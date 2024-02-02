import { NextFunction, Request, Response } from 'express';
import { APIError } from '../errors';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

export const errorMiddleware = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV == 'development') {
    console.error(err);
  }
  if (
    err instanceof PrismaClientValidationError ||
    err instanceof SyntaxError
  ) {
    return res.status(403).json({ message: 'Invalid data' });
  }
  if (err instanceof APIError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Server error' });
};
