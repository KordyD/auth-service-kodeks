import { Application } from 'express';
import { usersRouter } from './users.routes';
import { groupsRouter } from './groups.routes';
import { servicesRouter } from './services.routes';
import { modulesRouter } from './modules.routes';
import { accessRouter } from './access.routes';

// TODO: Проверка уникальности при изменении

const mountRoutes = (app: Application) => {
  app.use('/users', usersRouter);
  app.use('/groups', groupsRouter);
  app.use('/services', servicesRouter);
  app.use('/modules', modulesRouter);
  app.use('/access', accessRouter);
};

export default mountRoutes;
