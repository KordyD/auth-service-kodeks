import { NextFunction, Request, Response } from 'express';
import accessService from '../services/access.service';
import { validationResult } from 'express-validator';
import { APIError } from '../errors';

class accessController {
  async addAccessRights(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw APIError.BadRequestError(result.array()[0].msg, result.array());
      }

      const accessData = await accessService.addAccessRights(req.body);
      res.json(accessData);
    } catch (error) {
      next(error);
    }
  }
  async deleteAccessRights(req: Request, res: Response, next: NextFunction) {
    try {
      const accessData = await accessService.deleteAccessRights(req.body);
      res.json(accessData);
    } catch (error) {
      next(error);
    }
  }
  async getAccessRightsForModule(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const accessData = await accessService.getAccessRightsForModule(
        Number(req.params.moduleId)
      );
      res.json(accessData);
    } catch (error) {
      next(error);
    }
  }
}

export default new accessController();
