import { Application } from 'express';
import { usersRouter } from './users.routes';
import { groupsRouter } from './groups.routes';
import { servicesRouter } from './services.routes';
import { modulesRouter } from './modules.routes';

// TODO: Проверка уникальности при изменении

const mountRoutes = (app: Application) => {
  app.use('/users', usersRouter);
  app.use('/groups', groupsRouter);
  app.use('/services', servicesRouter);
  app.use('/modules', modulesRouter);
};

export default mountRoutes;
