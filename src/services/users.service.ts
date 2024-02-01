import { hash } from 'bcrypt';
import { prisma } from '../db';
import { APIError } from '../errors';
import { searchParamsI, userDataI } from './interfaces';
import { Prisma } from '@prisma/client';

const select: Prisma.usersSelect = {
  login: true,
  email: true,
  id: true,
  first_name: true,
  last_name: true,
  patronymic: true,
  prefix: true,
  suffix: true,
  comment: true,
  auth_origins: true,
  departments: true,
};

class usersService {
  async getUsers(searchParams?: searchParamsI) {
    const users = await prisma.users.findMany({
      where: {
        auth_origins: {
          name: 'Локальный',
        },
        OR: [
          {
            first_name: {
              contains: searchParams?.search || '',
            },
          },
          {
            login: {
              contains: searchParams?.search || '',
            },
          },
          {
            email: {
              contains: searchParams?.search || '',
            },
          },
          {
            last_name: {
              contains: searchParams?.search || '',
            },
          },
          {
            patronymic: {
              contains: searchParams?.search || '',
            },
          },
          {
            departments: {
              name: {
                contains: searchParams?.search || '',
              },
            },
          },
        ],
      },
      take: Number(searchParams?.limit) || 20,
      select,
    });
    return users;
  }
  async getUser(id: number) {
    const user = await prisma.users.findFirst({
      where: {
        AND: [
          {
            auth_origins: {
              name: 'Локальный',
            },
          },
          { id },
        ],
      },
      select: {
        ...select,
        users_groups: {
          select: { groups: true },
        },
      },
    });
    return user;
  }
  async createUser(userData: userDataI) {
    const department = await prisma.departments.findFirst({
      where: {
        name: userData.department,
      },
    });
    const authOrigin = await prisma.auth_origins.findFirst({
      where: {
        name: 'Локальный',
      },
    });
    const candidate = await prisma.users.findFirst({
      where: {
        OR: [{ email: userData.email }, { login: userData.login }],
      },
    });
    if (candidate) {
      throw APIError.BadRequestError('User already exists');
    }
    if (!department) {
      throw APIError.BadRequestError("Department doesn't exist");
    }
    if (!authOrigin) {
      throw APIError.BadRequestError("Auth origin 'Локальный' doesn't exist");
    }
    const hashedPassword = await hash(userData.password, 10);
    const user = await prisma.users.create({
      data: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        patronymic: userData.patronymic,
        password: hashedPassword,
        login: userData.login,
        email: userData.email,
        prefix: userData.prefix,
        suffix: userData.suffix,
        comment: userData.comment,
        auth_origin_id: authOrigin.id,
        department_id: department.id,
      },
      select,
    });
    return user;
  }
  async editUser(id: number, userData: userDataI) {
    const department = await prisma.departments.findFirst({
      where: {
        name: userData.department,
      },
    });
    const candidate = await prisma.users.findFirst({
      where: { id },
    });
    if (!department) {
      throw APIError.BadRequestError("Department doesn't exist");
    }
    if (!candidate) {
      throw APIError.BadRequestError("User doesn't exist");
    }
    const hashedPassword = await hash(userData.password, 10);

    const user = await prisma.users.update({
      where: { id },
      data: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        patronymic: userData.patronymic,
        password: hashedPassword,
        login: userData.login,
        email: userData.email,
        prefix: userData.prefix,
        suffix: userData.suffix,
        comment: userData.comment,
        department_id: department.id,
      },

      select,
    });
    return user;
  }
  async deleteUser(id: number) {
    const candidate = await prisma.users.findFirst({
      where: { id },
    });
    if (!candidate) {
      throw APIError.BadRequestError("User doesn't exist");
    }
    const user = await prisma.users.delete({
      where: { id },
      select,
    });
    return user;
  }
}

export default new usersService();
