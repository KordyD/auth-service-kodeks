import { Router } from 'express';
import { body } from 'express-validator';
import modulesController from '../controllers/modules.controller';

export const modulesRouter = Router();

const validator = [
  body('name').notEmpty(),
  body('id').isEmpty(),
  body('service_id').notEmpty(),
];

modulesRouter.get('/', modulesController.getModules);
modulesRouter.get('/:moduleId', modulesController.getModule);
modulesRouter.post('/create', validator, modulesController.createModule);
modulesRouter.put('/edit/:moduleId', modulesController.editModule);
modulesRouter.delete('/delete/:moduleId', modulesController.deleteModule);