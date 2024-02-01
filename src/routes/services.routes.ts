import { Router } from 'express';
import servicesController from '../controllers/services.controller';
import { body } from 'express-validator';
import { tokenCheckMiddleware } from '../middlewares/tokenCheck.middleware';

export const servicesRouter = Router();

const validator = [body('name').notEmpty()];

servicesRouter.get('/', tokenCheckMiddleware, servicesController.getServices);
servicesRouter.get(
  '/:serviceId',
  tokenCheckMiddleware,
  servicesController.getService
);
servicesRouter.post(
  '/create',
  validator,
  tokenCheckMiddleware,
  servicesController.createService
);
servicesRouter.put(
  '/edit/:serviceId',
  validator,
  tokenCheckMiddleware,
  servicesController.editService
);
servicesRouter.delete(
  '/delete/:serviceId',
  tokenCheckMiddleware,
  servicesController.deleteService
);
