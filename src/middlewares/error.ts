import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    errorStack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    success: false,
  });
};
export default globalErrorHandler;
