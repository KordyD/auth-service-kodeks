import { Router } from 'express';
import groupsController from '../controllers/groups.controller';
import { body } from 'express-validator';
import { tokenCheckMiddleware } from '../middlewares/tokenCheck.middleware';

export const groupsRouter = Router();

const validator = [body('name').notEmpty()];

groupsRouter.get('/', tokenCheckMiddleware, groupsController.getGroups);
groupsRouter.get('/:groupId', tokenCheckMiddleware, groupsController.getGroup);
groupsRouter.post(
  '/create',
  validator,
  tokenCheckMiddleware,
  groupsController.createGroup
);
groupsRouter.put(
  '/edit/:groupId',
  validator,
  tokenCheckMiddleware,
  groupsController.editGroup
);
groupsRouter.delete(
  '/delete/:groupId',
  tokenCheckMiddleware,
  groupsController.deleteGroup
);
groupsRouter.post(
  '/add-user/:groupId/:userId',
  tokenCheckMiddleware,
  groupsController.addUser
);
groupsRouter.delete(
  '/delete-user/:relationId',
  tokenCheckMiddleware,
  groupsController.deleteUser
);
