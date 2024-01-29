import { Application } from 'express';
import { usersRouter } from './users.routes';
import { groupsRouter } from './groups.routes';
import { servicesRouter } from './services.routes';

const mountRoutes = (app: Application) => {
  app.use('/users', usersRouter);
  app.use('/groups', groupsRouter);
  app.use('/services', servicesRouter);
};

export default mountRoutes;
