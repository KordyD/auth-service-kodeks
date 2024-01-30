import { Router } from 'express';
import groupsController from '../controllers/groups.controller';
import { body } from 'express-validator';

export const groupsRouter = Router();

const validator = [
  body('id').isEmpty(),
  body('name').notEmpty(),
  body('auth_origin_id').notEmpty(),
  body('description').notEmpty(),
];

groupsRouter.get('/', groupsController.getGroups);
groupsRouter.get('/:groupId', groupsController.getGroup);
groupsRouter.post('/create', validator, groupsController.createGroup);
groupsRouter.put('/edit/:groupId', groupsController.editGroup);
groupsRouter.delete('/delete/:groupId', groupsController.deleteGroup);
groupsRouter.post('/add-user/:groupId/:userId', groupsController.addUser);
