import { CandlestickChart } from "../core/CandlestickChart";

export function TemperatureCandlestickChart({ data, title }: { data: any[]; title?: string }) {
  return (
    <CandlestickChart
      options={{
        title: {
          text: `${title} Temperature Chart`,
          align: "left"
        },
        xaxis: {
          type: "datetime"
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        }
      }}
      series={data}
      height={350}
    />
  );
}
