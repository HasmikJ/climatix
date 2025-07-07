import { connectMongo } from "./config/mongo";
import { TemperatureService } from "./temperature/temperature.service";
import { WeatherProcessor } from "./weather/weather-record.processor";
import { WeatherRecordRepository } from "./weather/weather-record.repo";

export class Container {
  private _weatherRepository: WeatherRecordRepository | null = null;
  private _temperatureService: TemperatureService | null = null;
  private _weatherProcessor: WeatherProcessor | null = null;

  async init(): Promise<void> {
    try {
      // Connect to MongoDB before instantiating any models
      await connectMongo();

      this._weatherRepository = new WeatherRecordRepository();
      this._weatherProcessor = new WeatherProcessor(this._weatherRepository);
      this._temperatureService = new TemperatureService(this._weatherRepository);

      console.log("🧩 Container initialized.");
    } catch (error) {
      console.error("❌ Failed to initialize Container:", error);
      process.exit(1);
    }
  }

  get weatherRepository(): WeatherRecordRepository {
    if (!this._weatherRepository) throw new Error("WeatherRepository not initialized");
    return this._weatherRepository;
  }

  get temperatureService(): TemperatureService {
    if (!this._temperatureService) throw new Error("TemperatureService not initialized");
    return this._temperatureService;
  }

  get weatherProcessor(): WeatherProcessor {
    if (!this._weatherProcessor) throw new Error("WeatherProcessor not initialized");
    return this._weatherProcessor;
  }
}

export const container = new Container();
