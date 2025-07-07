import mongoose, { Document, Schema } from "mongoose";
import { WeatherRecord } from "../shared/types/weather-record.types";

interface WeatherRecordDocument extends WeatherRecord, Document {}

const WeatherRecordSchema = new Schema<WeatherRecordDocument>({
  city: { type: String, required: true },
  timestamp: { type: Date, required: true },
  temperature: { type: Number, required: true },
  windspeed: { type: Number, required: true },
  winddirection: { type: Number, required: true },

  // This is used to expire the document after 2 days
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 48 // 48 hours in seconds - can be placed in the config file
  }
});

export const WeatherEventModel = mongoose.model<WeatherRecordDocument>(
  "weatherRecords",
  WeatherRecordSchema,
  "weatherRecords"
);

// export const WeatherEventModel = mongoose.model<WeatherRecordDocument>(
//   "weatherevents",
//   WeatherRecordSchema,
//   "weatherevents"
// );
