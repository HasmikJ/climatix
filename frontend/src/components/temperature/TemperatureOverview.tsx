import { useQuery } from "@apollo/client";
import { groupBy, map } from "lodash";
import { useEffect } from "react";
import { GET_ALL_CANDLESTICKS } from "../../graphql/candlesticks.queries";
import "./temperature-overview.css";
import { TemperatureCandlestickChart } from "./TemperatureCandlestickChart";
import { toChartData } from "./temperatureChart.utils";

export function TemperatureOverview() {
  const { data, loading, error, startPolling, stopPolling } = useQuery(GET_ALL_CANDLESTICKS, {
    variables: {
      cities: ["Berlin", "CapeTown", "NewYork"], // or dynamically from user input
      // pollInterval: 5000,
      fetchPolicy: "network-only", // Ensures we always get the latest data
      notifyOnNetworkStatusChange: true // Allows the component to re-render on network status changes
    }
  });

  useEffect(() => {
    startPolling(5000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="temperature-overview">
      <h1>Temperature Overview</h1>
      {map(groupBy(data.getCandlesticks, "city"), (cityData, city) => (
        <TemperatureCandlestickChart key={city} data={toChartData(cityData)} title={city} />
      ))}
    </div>
  );
}
