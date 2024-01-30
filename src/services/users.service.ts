import { prisma } from '../db';
import { APIError } from '../errors';
import { searchParamsI, userDataI } from './interfaces';

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
      select: {
        login: true,
        email: true,
        id: true,
        first_name: true,
        last_name: true,
        patronymic: true,
        prefix: true,
        suffix: true,
        comment: true,
        auth_origin_id: true,
        department_id: true,
      },
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
        login: true,
        email: true,
        id: true,
        first_name: true,
        last_name: true,
        patronymic: true,
        prefix: true,
        suffix: true,
        comment: true,
        auth_origin_id: true,
        department_id: true,
        users_groups: {
          select: {
            groups: true,
          },
        },
      },
    });
    return user;
  }
  async createUser(userData: userDataI) {
    const isDepartmentExists = await prisma.departments.findFirst({
      where: {
        id: userData.department_id,
      },
    });
    const isAuthOriginExists = await prisma.auth_origins.findFirst({
      where: {
        id: userData.auth_origin_id,
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
    if (!isDepartmentExists) {
      throw APIError.BadRequestError("Department doesn't exist");
    }
    if (!isAuthOriginExists) {
      throw APIError.BadRequestError("Auth origin doesn't exist");
    }
    const user = await prisma.users.create({
      data: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        patronymic: userData.patronymic,
        password: userData.password,
        login: userData.login,
        email: userData.email,
        prefix: userData.prefix,
        suffix: userData.suffix,
        comment: userData.comment,
        auth_origin_id: 2,
        department_id: userData.department_id,
      },
      select: {
        login: true,
        email: true,
        id: true,
        first_name: true,
        last_name: true,
        patronymic: true,
        prefix: true,
        suffix: true,
        comment: true,
        auth_origin_id: true,
        department_id: true,
      },
    });
    return user;
  }
  async editUser(id: number, userData: userDataI) {
    const candidate = await prisma.users.findFirst({
      where: { id },
    });
    if (!candidate) {
      throw APIError.BadRequestError("User doesn't exist");
    }
    const user = await prisma.users.update({
      where: { id },
      data: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        patronymic: userData.patronymic,
        password: userData.password,
        login: userData.login,
        email: userData.email,
        prefix: userData.prefix,
        suffix: userData.suffix,
        comment: userData.comment,
        auth_origin_id: 2,
        department_id: userData.department_id,
      },

      select: {
        login: true,
        email: true,
        id: true,
        first_name: true,
        last_name: true,
        patronymic: true,
        prefix: true,
        suffix: true,
        comment: true,
        auth_origin_id: true,
        department_id: true,
      },
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
      select: {
        login: true,
        email: true,
        id: true,
        first_name: true,
        last_name: true,
        patronymic: true,
        prefix: true,
        suffix: true,
        comment: true,
        auth_origin_id: true,
        department_id: true,
      },
    });
    return user;
  }
}

export default new usersService();
