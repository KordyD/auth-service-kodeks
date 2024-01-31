import { Router } from 'express';
import usersController from '../controllers/users.controller';
import { body } from 'express-validator';
import { tokenCheckMiddleware } from '../middlewares/tokenCheck.middleware';

export const usersRouter = Router();

const validator = [
  body('login').notEmpty(),
  body('email').notEmpty().isEmail(),
  body('password').notEmpty(),
  body('first_name').notEmpty(),
  body('department_id').notEmpty(),
  body('auth_origin_id').notEmpty(),
];

usersRouter.get('/', tokenCheckMiddleware, usersController.getUsers);
usersRouter.get('/:userId', tokenCheckMiddleware, usersController.getUser);
usersRouter.post(
  '/create',
  validator,
  tokenCheckMiddleware,
  usersController.createUser
);
usersRouter.put(
  '/edit/:userId',
  validator,
  tokenCheckMiddleware,
  usersController.editUser
);
usersRouter.delete(
  '/delete/:userId',
  tokenCheckMiddleware,
  usersController.deleteUser
);
