import { ProcessorKey } from "../core/events/event-processor-registry";
import { WeatherRecord } from "../shared/types/weather-record.types";
import { BaseWebSocketClient } from "./base-web-socket.client";

export class WeatherWebSocketClient extends BaseWebSocketClient<WeatherRecord> {
  constructor(wsUrl: string) {
    super(wsUrl, ProcessorKey.WEATHER);
  }

  protected parseEvent(data: string): WeatherRecord {
    return JSON.parse(data);
  }
}
