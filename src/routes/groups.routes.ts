import { Router } from 'express';
import groupsController from '../controllers/groups.controller';
import { body } from 'express-validator';
import { tokenCheckMiddleware } from '../middlewares/tokenCheck.middleware';

export const groupsRouter = Router();

const validator = [body('name').notEmpty()];

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
 *    UserGroup:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        user_id:
 *          type: integer
 *        group_id:
 *          type: integer
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
 *    GroupWithUsers:
 *      allOf:
 *        - $ref: '#/components/schemas/Group'
 *      properties:
 *        users_groups:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              users:
 *                $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get list of groups
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search term for filtering groups
 *         type: string
 *       - name: limit
 *         in: query
 *         description: Limit the number of groups returned
 *         type: integer
 *         default: 20
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 */

groupsRouter.get('/', tokenCheckMiddleware, groupsController.getGroups);

/**
 * @swagger
 * /groups/{groupId}:
 *   get:
 *     summary: Get group by id
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: groupId
 *         in: path
 *         description: ID of the group
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupWithUsers'
 */
groupsRouter.get('/:groupId', tokenCheckMiddleware, groupsController.getGroup);

/**
 * @swagger
 * /groups/create:
 *   post:
 *     summary: Create new group
 *     tags:
 *       - Groups
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 */
groupsRouter.post(
  '/create',
  validator,
  tokenCheckMiddleware,
  groupsController.createGroup
);
/**
 * @swagger
 * /groups/edit/{groupId}:
 *   put:
 *     summary: Edit group
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: groupId
 *         in: path
 *         description: ID of the group
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
 *              - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 */

groupsRouter.put(
  '/edit/:groupId',
  validator,
  tokenCheckMiddleware,
  groupsController.editGroup
);

/**
 * @swagger
 * /groups/delete/{groupId}:
 *   delete:
 *     summary: Delete group
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: groupId
 *         in: path
 *         description: ID of the group
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 */

groupsRouter.delete(
  '/delete/:groupId',
  tokenCheckMiddleware,
  groupsController.deleteGroup
);
/**
 * @swagger
 * /groups/add-user/{groupId}/{userId}:
 *   post:
 *     summary: Add user to group
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: groupId
 *         in: path
 *         description: ID of the group
 *         required: true
 *         schema:
 *           type: integer
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
 *               $ref: '#/components/schemas/UserGroup'
 */
groupsRouter.post(
  '/add-user/:groupId/:userId',
  tokenCheckMiddleware,
  groupsController.addUser
);
/**
 * @swagger
 * /groups/delete-user/{relationId}:
 *   delete:
 *     summary: Delete user from group
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: relationId
 *         in: path
 *         description: ID of the relation user-group
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserGroup'
 */

groupsRouter.delete(
  '/delete-user/:relationId',
  tokenCheckMiddleware,
  groupsController.deleteUser
);
