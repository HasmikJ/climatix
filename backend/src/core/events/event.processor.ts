import { BaseRecord } from "../../shared/types/record.types";

/**
 * EventProcessor is a generic class that processes events and provides methods to add events and query aggregated data.
 * @template TEvent - The type of event to process.
 */
export abstract class EventProcessor<TEvent extends BaseRecord> {
  /**
   * Add a single event to the processor.
   */
  abstract addEvent(event: TEvent): void;
}
