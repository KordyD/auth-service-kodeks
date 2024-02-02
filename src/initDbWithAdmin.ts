import { config } from 'dotenv';
config();

import { hash } from 'bcrypt';
import { prisma } from './db';

const init = async () => {
  await prisma.access_rights.deleteMany({});
  await prisma.users_groups.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.groups.deleteMany({});
  await prisma.departments.deleteMany({});
  await prisma.modules.deleteMany({});
  await prisma.services.deleteMany({});
  await prisma.auth_origins.deleteMany({});

  await prisma.auth_origins.create({
    data: { name: 'Домен' },
  });
  const authOrigin = await prisma.auth_origins.create({
    data: { name: 'Локальный' },
  });

  await prisma.departments.create({
    data: { name: 'Администратор' },
  });

  await prisma.users.create({
    data: {
      email: 'admin@mail.com',
      first_name: 'admin',
      login: 'admin',
      password: await hash('12345', 10),
      auth_origin_id: authOrigin.id,
    },
  });
};

init();
