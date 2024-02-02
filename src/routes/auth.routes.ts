import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { body } from 'express-validator';
import { tokenCheckMiddleware } from '../middlewares/tokenCheck.middleware';

export const authRouter = Router();

const validator = [body('login').notEmpty(), body('password').notEmpty()];

/**
 * @swagger
 * components:
 *  schemas:
 *    Token:
 *      type: object
 *      properties:
 *        token:
 *          type: string
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Get auth token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - login
 *              - password
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 */

authRouter.post('/login', validator, authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Delete token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         content:
 *           text/plain:
 *             schema:
 *               type: boolean
 *               example: true
 */

authRouter.post('/logout', tokenCheckMiddleware, authController.logout);
