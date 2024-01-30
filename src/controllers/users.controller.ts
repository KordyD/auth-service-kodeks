import { NextFunction, Request, Response } from 'express';
import usersService from '../services/users.service';
import { validationResult } from 'express-validator';
import { APIError } from '../errors';

class usersController {
  constructor() {}
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const usersData = await usersService.getUsers(req.query);
      res.json(usersData);
    } catch (error) {
      next(error);
    }
  }
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await usersService.getUser(Number(req.params.userId));
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw APIError.BadRequestError(result.array()[0].msg, result.array());
      }
      const userData = await usersService.createUser(req.body);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await usersService.editUser(
        Number(req.params.userId),
        req.body
      );
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await usersService.deleteUser(Number(req.params.userId));
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
}

export default new usersController();
