import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { APIError } from '../errors';
import modulesService from '../services/modules.service';

class modulesController {
  async getModulesForService(req: Request, res: Response, next: NextFunction) {
    try {
      const modulesData = await modulesService.getModules(
        Number(req.params.serviceId),
        req.query
      );
      res.json(modulesData);
    } catch (error) {
      next(error);
    }
  }
  async getModule(req: Request, res: Response, next: NextFunction) {
    try {
      const moduleData = await modulesService.getModule(
        Number(req.params.moduleId)
      );
      res.json(moduleData);
    } catch (error) {
      next(error);
    }
  }
  async createModule(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw APIError.BadRequestError(result.array()[0].msg, result.array());
      }
      const moduleData = await modulesService.createModule(req.body);
      res.json(moduleData);
    } catch (error) {
      next(error);
    }
  }
  async editModule(req: Request, res: Response, next: NextFunction) {
    try {
      const moduleData = await modulesService.editModule(
        Number(req.params.moduleId),
        req.body
      );
      res.json(moduleData);
    } catch (error) {
      next(error);
    }
  }
  async deleteModule(req: Request, res: Response, next: NextFunction) {
    try {
      const moduleData = await modulesService.deleteModule(
        Number(req.params.moduleId)
      );
      res.json(moduleData);
    } catch (error) {
      next(error);
    }
  }
}

export default new modulesController();
