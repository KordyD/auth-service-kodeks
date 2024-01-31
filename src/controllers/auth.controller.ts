import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { APIError } from '../errors';
import authService from '../services/auth.service';

class authController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw APIError.BadRequestError(result.array()[0].msg, result.array());
      }
      const token = await authService.login(req.body);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('token');
      // Middleware уже верифицировал токен
      const token = req.headers.authorization?.split(' ')[1] as string;
      await authService.logout(token);
      res.send(true);
    } catch (error) {
      next(error);
    }
  }
}

export default new authController();
