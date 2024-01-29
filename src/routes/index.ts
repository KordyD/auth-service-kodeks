import { Application } from 'express';
import { usersRouter } from './users.routes';
import { groupsRouter } from './groups.routes';

const mountRoutes = (app: Application) => {
  app.use('/users', usersRouter);
  app.use('/groups', groupsRouter);
};

export default mountRoutes;
