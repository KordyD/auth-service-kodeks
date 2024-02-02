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

/**
 * @swagger
 * components:
 *  schemas:
 *    Service:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        id:
 *          type: integer
 *        name:
 *          type: string
 *        modules:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Module'
 *    Module:
 *      type: object
 *      required:
 *        - name
 *        - service_id
 *      properties:
 *        id:
 *          type: integer
 *        name:
 *          type: string
 *        service_id:
 *          type: integer
 *    Access:
 *      type: object
 *      required:
 *        - module_id
 *      properties:
 *        id:
 *          type: integer
 *        module_id:
 *          type: integer
 *        group_id:
 *          type: integer
 *        user_id:
 *          type: integer
 *
 */

/**
 * @swagger
 * /access/{moduleId}:
 *   get:
 *     summary: Get access rights for module
 *     tags:
 *       - Access
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         required: true,
 *         description: Id of module
 *         type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Access'
 */

accessRouter.get(
  '/:moduleId',
  tokenCheckMiddleware,
  accessController.getAccessRightsForModule
);
/**
 * @swagger
 * /access/provide:
 *   post:
 *     summary: Provide access for user or group
 *     tags:
 *       - Access
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - module_id
 *             properties:
 *               module_id:
 *                 type: integer
 *               group_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Access'
 */
accessRouter.post(
  '/provide',
  validator,
  tokenCheckMiddleware,
  accessController.addAccessRights
);
/**
 * @swagger
 * /access/delete:
 *   delete:
 *     summary: Delete access for user or group
 *     tags:
 *       - Access
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - module_id
 *             properties:
 *               module_id:
 *                 type: integer
 *               group_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Access'
 */

accessRouter.delete(
  '/delete',
  tokenCheckMiddleware,
  accessController.deleteAccessRights
);
