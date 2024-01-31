import { Router } from 'express';
import { body } from 'express-validator';
import modulesController from '../controllers/modules.controller';
import { tokenCheckMiddleware } from '../middlewares/tokenCheck.middleware';

export const modulesRouter = Router();

const validator = [body('name').notEmpty(), body('service_id').notEmpty()];

modulesRouter.get('/:serviceId', tokenCheckMiddleware, modulesController.getModulesForService);
modulesRouter.get('/:moduleId', tokenCheckMiddleware, modulesController.getModule);
modulesRouter.post('/create', validator, tokenCheckMiddleware, modulesController.createModule);
modulesRouter.put('/edit/:moduleId', validator, tokenCheckMiddleware, modulesController.editModule);
modulesRouter.delete('/delete/:moduleId', tokenCheckMiddleware, modulesController.deleteModule);
