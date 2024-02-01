import { hash } from 'bcrypt';
import { prisma } from '../src/db';
import { faker } from '@faker-js/faker';

export const setup = async () => {
  await prisma.auth_origins.create({
    data: { name: 'Домен' },
  });
  const authOrigin = await prisma.auth_origins.create({
    data: { name: 'Локальный' },
  });

  const testDepartment = await prisma.departments.create({
    data: { name: 'test1' },
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

  const testUser = await prisma.users.create({
    data: {
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      first_name: faker.person.firstName(),
      department_id: testDepartment.id,
      auth_origin_id: authOrigin.id,
    },
  });

  const testGroup = await prisma.groups.create({
    data: {
      name: faker.person.jobDescriptor(),
      auth_origin_id: authOrigin.id,
    },
  });
  const testService = await prisma.services.create({
    data: {
      name: faker.person.jobDescriptor(),
    },
  });
  const testModule = await prisma.modules.create({
    data: {
      name: faker.person.jobDescriptor(),
      service_id: testService.id,
    },
  });

  const testAccess = await prisma.access_rights.create({
    data: {
      module_id: testModule.id,
      group_id: testGroup.id,
    },
  });

  return { testUser, testGroup, testService, testModule, testAccess };
};

export const teardown = async () => {
  await prisma.access_rights.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.departments.deleteMany({});
  await prisma.groups.deleteMany({});
  await prisma.users_groups.deleteMany({});
  await prisma.modules.deleteMany({});
  await prisma.services.deleteMany({});
  await prisma.auth_origins.deleteMany({});
};
