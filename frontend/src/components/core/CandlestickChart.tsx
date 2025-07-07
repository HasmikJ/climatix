import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export type CandlestickChartProps = {
  options: ApexOptions;
  series: any[];
  height?: number;
  width?: number;
};

export const CandlestickChart = ({ options, series, height, width }: CandlestickChartProps) => {
  return (
    <Chart
      options={{ ...options }}
      series={series}
      type="candlestick"
      height={height}
      width={width}
    />
  );
};
