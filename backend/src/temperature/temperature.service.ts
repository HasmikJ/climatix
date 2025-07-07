import _, { values } from "lodash";
import { DateTime } from "luxon";
import { Candlestick } from "../shared/types/weather-record.types";
import { WeatherRecordEntity } from "../weather/weather-record.entity";
import { WeatherRecordRepository } from "../weather/weather-record.repo";

const DEFAULT_TIME_RANGE_IN_HOURS = 24; // Can be stored in a config file

export class TemperatureService {
  constructor(private readonly weatherRepository = new WeatherRecordRepository()) {}

  /**
   * The method returns the OHLC data for a given city and time range.
   *
   * - The method can be improved by caching the data for a given city and/or time range.
   * - Validate the input data, e.g. city, time range, etc.
   */
  async getData(query: {
    cities: string[];
    from?: string;
    to?: string;
    intervalMinutes?: number;
  }): Promise<Candlestick[]> {
    // If no time range is provided, we will return the data for the default time range
    if (!query.from && !query.to) {
      query.from = new Date(
        Date.now() - DEFAULT_TIME_RANGE_IN_HOURS * 60 * 60 * 1000
      ).toISOString();
      query.to = new Date(Date.now()).toISOString();
    }

    const weatherEntities = await this.weatherRepository.findByCitiesAndTimeRange(
      query.cities,
      query.from,
      query.to
    );

    return this.toOHLCByInterval(weatherEntities, query.intervalMinutes); // Hourly intervals
  }

  private groupByInterval(
    weather: WeatherRecordEntity[],
    intervalMs: number
  ): Record<string, WeatherRecordEntity[]> {
    return _.groupBy(weather, (w) => {
      const ts = w.timestamp.getTime();
      const floored = Math.floor(ts / intervalMs) * intervalMs;

      // Format floored timestamp to ISO string at bucket start
      const bucketISO = DateTime.fromMillis(floored).toUTC().toISO();
      return `${w.city}-${bucketISO}`;
    });
  }

  // If no interval is provided, we will use the default interval of 1 hr /60 minutes
  private toOHLCByInterval(weather: WeatherRecordEntity[], intervalMinutes = 60): Candlestick[] {
    const intervalMs = intervalMinutes * 60 * 1000;

    const grouped = this.groupByInterval(weather, intervalMs);

    return values(grouped).map((entries) => {
      const sorted = _.sortBy(entries, (e) => e.timestamp.getTime());
      const temps = sorted.map((e) => e.temperature);
      const first = sorted[0];

      return {
        city: first.city,
        open: temps[0],
        close: temps[temps.length - 1],
        high: Math.max(...temps),
        low: Math.min(...temps),
        hour: DateTime.fromJSDate(first.timestamp).toUTC().startOf("hour").toISO() ?? ""
        // intervalMinutes
      };
    });
  }
}
