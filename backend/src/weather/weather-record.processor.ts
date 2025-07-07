import { ProcessorKey, processorRegistry } from "../core/events/event-processor-registry";
import { EventProcessor } from "../core/events/event.processor";
import { WeatherRecord } from "../shared/types/weather-record.types";
import { WeatherRecordEntity } from "./weather-record.entity";
import { WeatherRecordRepository } from "./weather-record.repo";

export class WeatherProcessor extends EventProcessor<WeatherRecord> {
  constructor(private readonly weatherRepository = new WeatherRecordRepository()) {
    super();
    /**
     * Register the processor with the registry
     * This is used to get the processor instance from the registry
     */
    processorRegistry.register(ProcessorKey.WEATHER, this);
  }

  addEvent(event: WeatherRecord): void {
    /**
     * Save the event to the database
     * - The event is saved to the database using the WeatherEventEntity.fromPlain method
     * - The event is saved to the database using the WeatherRepository.save method
     */
    this.weatherRepository.save(WeatherRecordEntity.fromPlain(event));
  }
}
