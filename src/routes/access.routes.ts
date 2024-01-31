import { Router } from 'express';
import accessController from '../controllers/access.controller';
import { body } from 'express-validator';
import { tokenCheckMiddleware } from '../middlewares/tokenCheck.middleware';

export const accessRouter = Router();

const validator = [
  body('module_id').notEmpty(),
  body('group_id').custom((value, { req }) => {
    if (!value && !req.body.user_id) {
      throw new Error('Either group_id or user_id should not be empty');
    }
    if (value && req.body.user_id) {
      throw new Error('group_id and user_id should not be both provided');
    }
    return true;
  }),
  body('user_id').custom((value, { req }) => {
    if (!value && !req.body.group_id) {
      throw new Error('Either group_id or user_id should not be empty');
    }
    if (value && req.body.group_id) {
      throw new Error('group_id and user_id should not be both provided');
    }
    return true;
  }),
];

accessRouter.get(
  '/:moduleId',
  tokenCheckMiddleware,
  accessController.getAccessRightsForModule
);
accessRouter.post(
  '/provide',
  validator,
  tokenCheckMiddleware,
  accessController.addAccessRights
);
accessRouter.delete(
  '/delete',
  tokenCheckMiddleware,
  accessController.deleteAccessRights
);
