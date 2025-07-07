import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { GET_ALL_CANDLESTICKS } from "./graphql/candlesticks.queries";

// Mock the TemperatureCandlestickChart component since it's a complex chart component
jest.mock("./components/temperature/TemperatureCandlestickChart", () => ({
  TemperatureCandlestickChart: ({ data }: { data: any }) => (
    <div data-testid="temperature-chart">
      Temperature Chart with {data?.length || 0} data points
    </div>
  )
}));

const mocks = [
  {
    request: {
      query: GET_ALL_CANDLESTICKS,
      variables: { cities: ["Berlin"], pollInterval: 5000 }
    },
    result: {
      data: {
        getCandlesticks: [
          {
            city: "Berlin",
            hour: "2023-01-01T00:00:00Z",
            open: 20.1,
            close: 21.5,
            high: 22.3,
            low: 19.8
          }
        ]
      }
    }
  }
];

const errorMocks = [
  {
    request: {
      query: GET_ALL_CANDLESTICKS,
      variables: { cities: ["Berlin"], pollInterval: 5000 }
    },
    error: new Error("Failed to fetch data")
  }
];

test("renders App component", () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  // Initially shows loading state
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("renders temperature chart when data is loaded", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  // Wait for the chart to appear after data loads
  const chartElement = await screen.findByTestId("temperature-chart");
  expect(chartElement).toBeInTheDocument();
  expect(chartElement).toHaveTextContent("Temperature Chart with 1 data points");
});

test("renders error message when query fails", async () => {
  render(
    <MockedProvider mocks={errorMocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  // Wait for error message to appear
  const errorElement = await screen.findByText(/Error:/);
  expect(errorElement).toBeInTheDocument();
  expect(errorElement).toHaveTextContent("Failed to fetch data");
});
