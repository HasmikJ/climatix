import { NextFunction, Request, Response } from "express";
import { BaseError } from "../shared/errors/BaseError";
import { ErrorLogData, ErrorResponse, HTTP_STATUS_NAMES, HttpStatus, JWT_ERRORS } from "../shared/errors/error.types";

/**
 * Global error handling middleware for Express
 * @param err - The error object
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function to pass control to the next middleware
 */
export const errorHandler = (
  err: Error | BaseError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error properties
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = "Server Error";

  // Handle different error types
  if (err instanceof BaseError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name in JWT_ERRORS) {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = JWT_ERRORS[err.name as keyof typeof JWT_ERRORS];
  } else if (err.message) {
    message = err.message;
  }

  const statusName = HTTP_STATUS_NAMES[statusCode];

  // Log detailed error info
  logError(err, req);

  // Send structured JSON response
  const response: ErrorResponse = {
    success: false,
    status: statusName,
    error: message
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * Log error details for debugging
 * @param err - The error object
 * @param req - The request object
 */
function logError(err: Error | BaseError, req: Request): void {
  const errorLog: ErrorLogData = {
    message: err.message,
    name: err.name,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    userAgent: req.get("User-Agent") || undefined,
    ip: req.ip,
    timestamp: new Date().toISOString()
  };

  console.error("Error Details:", JSON.stringify(errorLog, null, 2));
}
