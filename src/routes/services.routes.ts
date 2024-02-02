import { Router } from 'express';
import servicesController from '../controllers/services.controller';
import { body } from 'express-validator';
import { tokenCheckMiddleware } from '../middlewares/tokenCheck.middleware';

export const servicesRouter = Router();

const validator = [body('name').notEmpty()];

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
 * /services:
 *   get:
 *     summary: Get list of services
 *     tags:
 *       - Services
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
 *                 $ref: '#/components/schemas/Service'
 */
servicesRouter.get('/', tokenCheckMiddleware, servicesController.getServices);

/**
 * @swagger
 * /services/{serviceId}:
 *   get:
 *     summary: Get service by id
 *     tags:
 *       - Services
 *     parameters:
 *       - name: serviceId
 *         in: path
 *         description: ID of the service
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 */
servicesRouter.get(
  '/:serviceId',
  tokenCheckMiddleware,
  servicesController.getService
);
/**
 * @swagger
 * /services/create:
 *   post:
 *     summary: Create new service
 *     tags:
 *       - Services
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
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 */
servicesRouter.post(
  '/create',
  validator,
  tokenCheckMiddleware,
  servicesController.createService
);
/**
 * @swagger
 * /services/edit/{serviceId}:
 *   put:
 *     summary: Edit service
 *     tags:
 *       - Services
 *     parameters:
 *       - name: serviceId
 *         in: path
 *         description: ID of the service
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
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 */
servicesRouter.put(
  '/edit/:serviceId',
  validator,
  tokenCheckMiddleware,
  servicesController.editService
);

/**
 * @swagger
 * /services/delete/{serviceId}:
 *   delete:
 *     summary: Delete service
 *     tags:
 *       - Services
 *     parameters:
 *       - name: serviceId
 *         in: path
 *         description: ID of the service
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 */

servicesRouter.delete(
  '/delete/:serviceId',
  tokenCheckMiddleware,
  servicesController.deleteService
);
