import { BaseError } from "./BaseError";

export class RouteRegistrationError extends BaseError {
  constructor(controllerName: string, handlerName: string) {
    super(`Handler "${handlerName}" is not defined on ${controllerName}`, 500);
    this.name = "RouteRegistrationError";
  }
}
