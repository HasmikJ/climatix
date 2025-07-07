import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../shared/errors/NotFoundError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const message = `Route ${req.originalUrl} not found`;
  next(new NotFoundError(message));
};
