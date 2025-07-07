import WebSocket from "ws";
import { ProcessorKey, processorRegistry } from "../core/events/event-processor-registry";
import { BaseRecord } from "../shared/types/record.types";

export abstract class BaseWebSocketClient<T extends BaseRecord> {
  protected ws!: WebSocket;

  constructor(
    protected wsUrl: string,
    protected processorKey: ProcessorKey,
    protected reconnectDelayMs = 5000 // Default to 5 seconds
  ) {}

  protected abstract parseEvent(data: string): T;

  connect() {
    this.ws = new WebSocket(this.wsUrl);

    this.ws.on("open", () => {
      console.log(`🟢 Connected to WebSocket stream at ${this.wsUrl}`);
    });

    this.ws.on("message", (data) => {
      try {
        const event = this.parseEvent(data.toString());
        const processor = processorRegistry.get(this.processorKey);
        if (!processor) {
          console.error(`Processor with key "${this.processorKey}" not found.`);
          return;
        }
        processor?.addEvent(event);
      } catch (error) {
        console.error("Failed to parse or process event:", error);
      }
    });

    this.ws.on("close", () => {
      console.log(`🔴 WebSocket disconnected. Reconnecting in ${this.reconnectDelayMs / 1000}s...`);
      setTimeout(() => this.connect(), this.reconnectDelayMs);
    });

    this.ws.on("error", (err) => {
      console.error("WebSocket error:", err.message);
    });
  }

  disconnect() {
    this.ws.close();
  }
}
