import { Router } from 'express';
import servicesController from '../controllers/services.controller';
import { body } from 'express-validator';

export const servicesRouter = Router();

const validator = [body('name').notEmpty()];

servicesRouter.get('/', servicesController.getServices);
servicesRouter.get('/:serviceId', servicesController.getService);
servicesRouter.post('/create', validator, servicesController.createService);
servicesRouter.put(
  '/edit/:serviceId',
  validator,
  servicesController.editService
);
servicesRouter.delete('/delete/:serviceId', servicesController.deleteService);
