import { Router } from 'express';
import { body } from 'express-validator';
import modulesController from '../controllers/modules.controller';
import { tokenCheckMiddleware } from '../middlewares/tokenCheck.middleware';

export const modulesRouter = Router();

const validator = [body('name').notEmpty(), body('service_id').notEmpty()];

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
 *
 */

/**
 * @swagger
 * /modules/all/{serviceId}:
 *   get:
 *     summary: Get list of modules for service
 *     tags:
 *       - Modules
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
 *       - name: serviceId
 *         in: path
 *         required: true,
 *         description: Id of service
 *         type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Module'
 */
modulesRouter.get(
  '/all/:serviceId',
  tokenCheckMiddleware,
  modulesController.getModulesForService
);
/**
 * @swagger
 * /modules/{moduleId}:
 *   get:
 *     summary: Get module by id
 *     tags:
 *       - Modules
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         description: ID of the module
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 */

modulesRouter.get(
  '/:moduleId',
  tokenCheckMiddleware,
  modulesController.getModule
);
/**
 * @swagger
 * /modules/create:
 *   post:
 *     summary: Create new module
 *     tags:
 *       - Modules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - name
 *              - service_id
 *             properties:
 *               name:
 *                 type: string
 *               service_id:
 *                 type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 */
modulesRouter.post(
  '/create',
  validator,
  tokenCheckMiddleware,
  modulesController.createModule
);
/**
 * @swagger
 * /modules/edit/{moduleId}:
 *   put:
 *     summary: Edit module
 *     tags:
 *       - Modules
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         description: ID of the module
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
 *              - service_id
 *             properties:
 *               name:
 *                 type: string
 *               service_id:
 *                 type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 */
modulesRouter.put(
  '/edit/:moduleId',
  validator,
  tokenCheckMiddleware,
  modulesController.editModule
);

/**
 * @swagger
 * /modules/delete/{moduleId}:
 *   delete:
 *     summary: Delete module
 *     tags:
 *       - Modules
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         description: ID of the module
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 */
modulesRouter.delete(
  '/delete/:moduleId',
  tokenCheckMiddleware,
  modulesController.deleteModule
);
