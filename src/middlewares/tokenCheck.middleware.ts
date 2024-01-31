import { NextFunction, Request, Response } from 'express';
import { APIError } from '../errors';
import tokenService from '../services/token.service';

export const tokenCheckMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(APIError.UnauthorizedError());
  }
  const userData = await tokenService.verifyToken(token);
  if (!userData) {
    return next(APIError.UnauthorizedError());
  }
  return next();
};
