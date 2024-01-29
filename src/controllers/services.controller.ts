import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { APIError } from '../errors';
import servicesService from '../services/services.service';

class servicesController {
  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const servicesData = await servicesService.getServices();
      res.json(servicesData);
    } catch (error) {
      next(error);
    }
  }
  async getService(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceData = await servicesService.getService(
        Number(req.params.serviceId)
      );
      res.json(serviceData);
    } catch (error) {
      next(error);
    }
  }
  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw APIError.BadRequestError(result.array()[0].msg, result.array());
      }
      const serviceData = await servicesService.createService(req.body);
      res.json(serviceData);
    } catch (error) {
      next(error);
    }
  }
  async editService(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceData = await servicesService.editService(
        Number(req.params.serviceId),
        req.body
      );
      res.json(serviceData);
    } catch (error) {
      next(error);
    }
  }
  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceData = await servicesService.deleteService(
        Number(req.params.serviceId)
      );
      res.json(serviceData);
    } catch (error) {
      next(error);
    }
  }
}

export default new servicesController();
