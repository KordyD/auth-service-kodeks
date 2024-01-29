import { Router } from 'express';
import usersController from '../controllers/users.controller';
import { body } from 'express-validator';

export const usersRouter = Router();

const validator = [
  body('id').isEmpty(),
  body('login').notEmpty(),
  body('email').notEmpty().isEmail(),
  body('password').notEmpty(),
  body('first_name').notEmpty(),
  body('department_id').notEmpty(),
  body('auth_origin_id').notEmpty(),
];

usersRouter.get('/', usersController.getUsers);
usersRouter.get('/:userId', usersController.getUser);
usersRouter.post('/create', validator, usersController.createUser);
usersRouter.put('/edit/:userId', usersController.editUser);
usersRouter.delete('/delete/:userId', usersController.deleteUser);
