import { NextFunction, Request, Response } from 'express';
import { APIError } from '../errors';

export const errorMiddleware = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  if (err instanceof APIError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Server error' });
};
