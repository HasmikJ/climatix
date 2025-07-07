import { container } from "../../container";
import { Candlestick } from "../../shared/types/weather-record.types";

export const temperatureResolvers = {
  Query: {
    getCandlesticks: async (
      _parent: any,
      args: { cities: string[]; from?: string; to?: string }
    ) => {
      const data = await container.temperatureService.getData({
        cities: args.cities,
        from: args.from,
        to: args.to,
        intervalMinutes: 60
      });

      return data ?? ([] as Candlestick[]);
    }
  }
};
