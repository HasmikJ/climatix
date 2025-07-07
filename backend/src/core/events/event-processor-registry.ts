import { BaseRecord } from "../../shared/types/record.types";
import { EventProcessor } from "./event.processor";

export enum ProcessorKey {
  WEATHER = "weather"
}

/**
 * ProcessorRegistry is a class that manages a registry of event processors.
 * It provides methods to register, get, and check for the existence of processors.
 */
class ProcessorRegistry {
  private processors = new Map<ProcessorKey, EventProcessor<BaseRecord>>();

  register(key: ProcessorKey, processor: EventProcessor<BaseRecord>) {
    if (this.processors.has(key)) {
      throw new Error(`Processor with key "${key}" is already registered.`);
    }
    this.processors.set(key, processor);

    console.log(`Registered processor with key: ${key}`);
  }

  get(key: ProcessorKey): EventProcessor<BaseRecord> {
    const processor = this.processors.get(key);
    if (!processor) {
      throw new Error(`Processor with key "${key}" not found.`);
    }
    return processor;
  }

  has(key: ProcessorKey): boolean {
    return this.processors.has(key);
  }
}

export const processorRegistry = new ProcessorRegistry();
