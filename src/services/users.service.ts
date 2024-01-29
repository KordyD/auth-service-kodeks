import { prisma } from '../db';
import { APIError } from '../errors';

interface userDataI {
  first_name: string;
  last_name?: string;
  patronymic?: string;
  auth_origin_id: number;
  email: string;
  login: string;
  prefix?: string;
  suffix?: string;
  comment?: string;
  password: string;
  department_id: number;
}

const select = {
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
};

class usersService {
  async getUsers() {
    const users = await prisma.users.findMany({
      where: {
        auth_origins: {
          name: 'Локальный',
        },
      },

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
      select,
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
      data: userData,
      select: {
        password: false,
        token: false,
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
      data: userData,
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
