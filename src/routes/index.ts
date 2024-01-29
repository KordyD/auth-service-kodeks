import { Application } from 'express';
import { usersRouter } from './users.routes';

const mountRoutes = (app: Application) => {
  app.use('/users', usersRouter);
};

export default mountRoutes;
