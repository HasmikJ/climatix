import { WeatherRecordEntity } from "../weather/weather-record.entity";
import { WeatherRecordRepository } from "../weather/weather-record.repo";
import { TemperatureService } from "./temperature.service";

// Mock the WeatherRepository
jest.mock("../weather/weather.repo");

describe("TemperatureService", () => {
  let temperatureService: TemperatureService;
  let mockWeatherRepository: jest.Mocked<WeatherRecordRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWeatherRepository = new WeatherRecordRepository() as jest.Mocked<WeatherRecordRepository>;
    temperatureService = new TemperatureService(mockWeatherRepository);
  });

  describe("getData", () => {
    it("should return candlestick data for a city with time range", async () => {
      const mockWeatherData = [
        new WeatherRecordEntity("London", new Date("2024-01-01T10:00:00Z"), 15, 10, 180),
        new WeatherRecordEntity("London", new Date("2024-01-01T10:15:00Z"), 16, 12, 185),
        new WeatherRecordEntity("London", new Date("2024-01-01T10:30:00Z"), 14, 8, 175),
        new WeatherRecordEntity("London", new Date("2024-01-01T11:00:00Z"), 18, 15, 190),
        new WeatherRecordEntity("London", new Date("2024-01-01T11:15:00Z"), 17, 13, 185)
      ];

      mockWeatherRepository.findByCitiesAndTimeRange.mockResolvedValue(mockWeatherData);

      const result = await temperatureService.getData({
        cities: ["London"],
        from: "2024-01-01T10:00:00Z",
        to: "2024-01-01T12:00:00Z"
      });

      expect(mockWeatherRepository.findByCitiesAndTimeRange).toHaveBeenCalledWith(
        ["London"],
        "2024-01-01T10:00:00Z",
        "2024-01-01T12:00:00Z"
      );

      expect(result).toHaveLength(2);

      expect(result[0]).toEqual({
        city: "London",
        hour: "2024-01-01T10:00:00.000Z",
        open: 15,
        close: 14,
        high: 16,
        low: 14
      });

      expect(result[1]).toEqual({
        city: "London",
        hour: "2024-01-01T11:00:00.000Z",
        open: 18,
        close: 17,
        high: 18,
        low: 17
      });
    });

    it("should set default time range when no from/to provided", async () => {
      const mockWeatherData = [
        new WeatherRecordEntity("Paris", new Date("2024-01-01T10:00:00Z"), 20, 5, 90)
      ];

      mockWeatherRepository.findByCitiesAndTimeRange.mockResolvedValue(mockWeatherData);

      const mockDate = new Date("2024-01-01T15:00:00Z");
      const originalNow = Date.now;
      Date.now = jest.fn(() => mockDate.getTime());

      await temperatureService.getData({ cities: ["Paris"] });

      const expectedFrom = new Date(mockDate.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const expectedTo = mockDate.toISOString();

      expect(mockWeatherRepository.findByCitiesAndTimeRange).toHaveBeenCalledWith(
        ["Paris"],
        expectedFrom,
        expectedTo
      );

      Date.now = originalNow;
    });

    it("should handle empty weather data", async () => {
      mockWeatherRepository.findByCitiesAndTimeRange.mockResolvedValue([]);

      const result = await temperatureService.getData({
        cities: ["Berlin"],
        from: "2024-01-01T10:00:00Z",
        to: "2024-01-01T12:00:00Z"
      });

      expect(result).toEqual([]);
    });

    it("should handle single weather event per hour", async () => {
      const mockWeatherData = [
        new WeatherRecordEntity("Tokyo", new Date("2024-01-01T10:00:00Z"), 25, 8, 120),
        new WeatherRecordEntity("Tokyo", new Date("2024-01-01T11:00:00Z"), 26, 9, 125)
      ];

      mockWeatherRepository.findByCitiesAndTimeRange.mockResolvedValue(mockWeatherData);

      const result = await temperatureService.getData({
        cities: ["Tokyo"],
        from: "2024-01-01T10:00:00Z",
        to: "2024-01-01T12:00:00Z"
      });

      expect(result).toHaveLength(2);

      expect(result[0]).toEqual({
        city: "Tokyo",
        hour: "2024-01-01T10:00:00.000Z",
        open: 25,
        close: 25,
        high: 25,
        low: 25
      });

      expect(result[1]).toEqual({
        city: "Tokyo",
        hour: "2024-01-01T11:00:00.000Z",
        open: 26,
        close: 26,
        high: 26,
        low: 26
      });
    });

    it("should handle repository errors", async () => {
      const error = new Error("Database connection failed");
      mockWeatherRepository.findByCitiesAndTimeRange.mockRejectedValue(error);

      await expect(
        temperatureService.getData({
          cities: ["Moscow"],
          from: "2024-01-01T10:00:00Z",
          to: "2024-01-01T12:00:00Z"
        })
      ).rejects.toThrow("Database connection failed");
    });

    it("should group data correctly across multiple cities and hours", async () => {
      mockWeatherRepository.findByCitiesAndTimeRange.mockImplementation((cities: string[]) => {
        if (cities.includes("London")) {
          return Promise.resolve([
            new WeatherRecordEntity("London", new Date("2024-01-01T10:00:00Z"), 15, 10, 180),
            new WeatherRecordEntity("London", new Date("2024-01-01T10:30:00Z"), 16, 12, 185),
            new WeatherRecordEntity("London", new Date("2024-01-01T11:00:00Z"), 18, 15, 190),
            new WeatherRecordEntity("London", new Date("2024-01-01T11:30:00Z"), 17, 13, 185)
          ]);
        }
        return Promise.resolve([]);
      });

      const result = await temperatureService.getData({
        cities: ["London"],
        from: "2024-01-01T10:00:00Z",
        to: "2024-01-01T12:00:00Z"
      });

      expect(result).toHaveLength(2);

      result.forEach((candlestick) => {
        expect(candlestick.city).toBe("London");
      });

      expect(result[0]).toEqual({
        city: "London",
        hour: "2024-01-01T10:00:00.000Z",
        open: 15,
        close: 16,
        high: 16,
        low: 15
      });

      expect(result[1]).toEqual({
        city: "London",
        hour: "2024-01-01T11:00:00.000Z",
        open: 18,
        close: 17,
        high: 18,
        low: 17
      });
    });
  });

  describe("toHourlyOHLC (private method)", () => {
    it("should correctly calculate OHLC values", async () => {
      const mockWeatherData = [
        new WeatherRecordEntity("Sydney", new Date("2024-01-01T10:00:00Z"), 22, 8, 150),
        new WeatherRecordEntity("Sydney", new Date("2024-01-01T10:15:00Z"), 24, 10, 155),
        new WeatherRecordEntity("Sydney", new Date("2024-01-01T10:30:00Z"), 23, 9, 152),
        new WeatherRecordEntity("Sydney", new Date("2024-01-01T10:45:00Z"), 25, 11, 158)
      ];

      mockWeatherRepository.findByCitiesAndTimeRange.mockResolvedValue(mockWeatherData);

      const result = await temperatureService.getData({
        cities: ["Sydney"],
        from: "2024-01-01T10:00:00Z",
        to: "2024-01-01T11:00:00Z"
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        city: "Sydney",
        hour: "2024-01-01T10:00:00.000Z",
        open: 22, // First temperature
        close: 25, // Last temperature
        high: 25, // Highest temperature
        low: 22 // Lowest temperature
      });
    });

    it("should handle unsorted data correctly", async () => {
      const mockWeatherData = [
        new WeatherRecordEntity("Melbourne", new Date("2024-01-01T10:30:00Z"), 18, 5, 120),
        new WeatherRecordEntity("Melbourne", new Date("2024-01-01T10:00:00Z"), 16, 3, 115),
        new WeatherRecordEntity("Melbourne", new Date("2024-01-01T10:45:00Z"), 19, 6, 125),
        new WeatherRecordEntity("Melbourne", new Date("2024-01-01T10:15:00Z"), 17, 4, 118)
      ];

      mockWeatherRepository.findByCitiesAndTimeRange.mockResolvedValue(mockWeatherData);

      const result = await temperatureService.getData({
        cities: ["Melbourne"],
        from: "2024-01-01T10:00:00Z",
        to: "2024-01-01T11:00:00Z"
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        city: "Melbourne",
        hour: "2024-01-01T10:00:00.000Z",
        open: 16, // First by timestamp (10:00)
        close: 19, // Last by timestamp (10:45)
        high: 19, // Highest temperature
        low: 16 // Lowest temperature
      });
    });
  });

  describe("edge cases", () => {
    it("should handle negative temperatures", async () => {
      const mockWeatherData = [
        new WeatherRecordEntity("Moscow", new Date("2024-01-01T10:00:00Z"), -5, 15, 270),
        new WeatherRecordEntity("Moscow", new Date("2024-01-01T10:30:00Z"), -3, 12, 265),
        new WeatherRecordEntity("Moscow", new Date("2024-01-01T10:45:00Z"), -8, 18, 275)
      ];

      mockWeatherRepository.findByCitiesAndTimeRange.mockResolvedValue(mockWeatherData);

      const result = await temperatureService.getData({
        cities: ["Moscow"],
        from: "2024-01-01T10:00:00Z",
        to: "2024-01-01T11:00:00Z"
      });

      expect(result[0]).toEqual({
        city: "Moscow",
        hour: "2024-01-01T10:00:00.000Z",
        open: -5,
        close: -8,
        high: -3,
        low: -8
      });
    });

    it("should handle decimal temperatures", async () => {
      const mockWeatherData = [
        new WeatherRecordEntity("Vancouver", new Date("2024-01-01T10:00:00Z"), 12.5, 8, 200),
        new WeatherRecordEntity("Vancouver", new Date("2024-01-01T10:30:00Z"), 13.7, 9, 205),
        new WeatherRecordEntity("Vancouver", new Date("2024-01-01T10:45:00Z"), 11.2, 7, 195)
      ];

      mockWeatherRepository.findByCitiesAndTimeRange.mockResolvedValue(mockWeatherData);

      const result = await temperatureService.getData({
        cities: ["Vancouver"],
        from: "2024-01-01T10:00:00Z",
        to: "2024-01-01T11:00:00Z"
      });

      expect(result[0]).toEqual({
        city: "Vancouver",
        hour: "2024-01-01T10:00:00.000Z",
        open: 12.5,
        close: 11.2,
        high: 13.7,
        low: 11.2
      });
    });
  });
});
