import { WeatherRecordEntity } from "./weather-record.entity";
import { WeatherEventModel } from "./weather-record.model";

export class WeatherRecordRepository {
  async save(event: WeatherRecordEntity): Promise<void> {
    await WeatherEventModel.create(event.toPlain());
  }

  async findByCitiesAndTimeRange(
    cities: string[],
    from?: string,
    to?: string
  ): Promise<WeatherRecordEntity[]> {
    const filter: any = { city: { $in: cities } };

    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = from;
      if (to) filter.timestamp.$lte = to;
    }

    const docs = await WeatherEventModel.find(filter).lean();
    return docs.map((doc) => WeatherRecordEntity.fromPlain(doc));
  }
}
