import { BaseRecord } from "./record.types";

export interface Candlestick {
  city: string;
  hour: string; // e.g. "2025-07-05T14:00:00Z"
  open: number;
  close: number;
  high: number;
  low: number;
}

export interface WeatherRecord extends BaseRecord {
  city: string;
  temperature: number;
  windspeed?: number;
  winddirection?: number;
}
