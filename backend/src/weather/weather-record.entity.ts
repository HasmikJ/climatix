export class WeatherRecordEntity {
  constructor(
    public readonly city: string,
    public readonly timestamp: Date,
    public readonly temperature: number,
    public readonly windspeed: number,
    public readonly winddirection: number
  ) {}

  static fromPlain(obj: any): WeatherRecordEntity {
    return new WeatherRecordEntity(
      obj.city,
      new Date(obj.timestamp),
      obj.temperature,
      obj.windspeed,
      obj.winddirection
    );
  }

  toPlain(): Record<string, any> {
    return {
      city: this.city,
      timestamp: this.timestamp,
      temperature: this.temperature,
      windspeed: this.windspeed,
      winddirection: this.winddirection
    };
  }
}
