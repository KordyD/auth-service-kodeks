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
  body('department').notEmpty(),
];

/**
 * @swagger
 * components:
 *  schemas:
 *    Department:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        name:
 *          type: string
 *
 *    AuthOrigin:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        name:
 *          type: string
 *
 *    Group:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        comment:
 *          type: string
 *
 *    User:
 *      type: object
 *      required:
 *        - login
 *        - email
 *        - password
 *        - first_name
 *        - department
 *      properties:
 *        id:
 *          type: integer
 *        login:
 *          type: string
 *        email:
 *          type: string
 *        first_name:
 *          type: string
 *        last_name:
 *          type: string
 *        patronymic:
 *          type: string
 *        prefix:
 *          type: string
 *        suffix:
 *          type: string
 *        comment:
 *          type: string
 *        auth_origin:
 *          $ref: '#/components/schemas/AuthOrigin'
 *        department:
 *          $ref: '#/components/schemas/Department'
 *
 *    UserWithGroups:
 *      allOf:
 *        - $ref: '#/components/schemas/User'
 *      properties:
 *        users_groups:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              groups:
 *                $ref: '#/components/schemas/Group'
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of users
 *     tags:
 *       - Users
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search term for filtering users
 *         type: string
 *       - name: limit
 *         in: query
 *         description: Limit the number of users returned
 *         type: integer
 *         default: 20
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
usersRouter.get('/', tokenCheckMiddleware, usersController.getUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by id
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithGroups'
 */

usersRouter.get('/:userId', tokenCheckMiddleware, usersController.getUser);

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - first_name
 *              - login
 *              - email
 *              - password
 *              - department
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               patronymic:
 *                 type: string
 *               password:
 *                 type: string
 *               login:
 *                 type: string
 *               email:
 *                 type: string
 *               prefix:
 *                 type: string
 *               suffix:
 *                 type: string
 *               comment:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
usersRouter.post(
  '/create',
  validator,
  tokenCheckMiddleware,
  usersController.createUser
);
/**
 * @swagger
 * /users/edit/{userId}:
 *   put:
 *     summary: Edit user
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - first_name
 *              - login
 *              - email
 *              - password
 *              - department
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               patronymic:
 *                 type: string
 *               password:
 *                 type: string
 *               login:
 *                 type: string
 *               email:
 *                 type: string
 *               prefix:
 *                 type: string
 *               suffix:
 *                 type: string
 *               comment:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

usersRouter.put(
  '/edit/:userId',
  validator,
  tokenCheckMiddleware,
  usersController.editUser
);

/**
 * @swagger
 * /users/delete/{userId}:
 *   delete:
 *     summary: Delete user
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

usersRouter.delete(
  '/delete/:userId',
  tokenCheckMiddleware,
  usersController.deleteUser
);
