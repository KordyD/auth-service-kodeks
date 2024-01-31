import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { body } from 'express-validator';
import { tokenCheckMiddleware } from '../middlewares/tokenCheck.middleware';

export const authRouter = Router();

const validator = [body('login').notEmpty(), body('password').notEmpty()];

authRouter.post('/login', validator, authController.login);
authRouter.post('/logout', tokenCheckMiddleware, authController.logout);
