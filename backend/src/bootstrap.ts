import { WeatherWebSocketClient } from "./clients/weather-web-socket.client";
import { container } from "./container";

const WS_URL = process.env.WEATHER_WS_URL || "";

/**
 * Bootstrap the application
 * @param app - The Express application
 */
export async function bootstrap() {
  // Initialize the container
  container.init();

  // Connect to the WebSocket stream
  const temperatureWebSocketClient = new WeatherWebSocketClient(WS_URL);
  temperatureWebSocketClient.connect();

  // Add other startup logic here
}
