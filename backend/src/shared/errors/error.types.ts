export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}

// HTTP status names mapping
export const HTTP_STATUS_NAMES: Record<HttpStatus, string> = {
  [HttpStatus.OK]: "OK",
  [HttpStatus.CREATED]: "Created",
  [HttpStatus.NO_CONTENT]: "No Content",
  [HttpStatus.BAD_REQUEST]: "Bad Request",
  [HttpStatus.UNAUTHORIZED]: "Unauthorized",
  [HttpStatus.FORBIDDEN]: "Forbidden",
  [HttpStatus.NOT_FOUND]: "Not Found",
  [HttpStatus.CONFLICT]: "Conflict",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "Internal Server Error"
};

// JWT error types
export const JWT_ERRORS = {
  JsonWebTokenError: "Invalid token",
  TokenExpiredError: "Token expired",
  NotBeforeError: "Token not active"
} as const;

// Error logging interface
export interface ErrorLogData {
  message: string;
  name: string;
  stack?: string;
  url: string;
  method: string;
  body: any;
  params: any;
  query: any;
  userAgent: string | undefined;
  ip: string | undefined;
  timestamp: string;
}

// Response interface
export interface ErrorResponse {
  success: false;
  status: string;
  error: string;
  stack?: string;
}
