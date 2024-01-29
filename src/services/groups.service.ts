import { prisma } from '../db';
import { APIError } from '../errors';

interface groupDataI {
  id: number;
  name: string;
  auth_origin_id: number;
  comment: string;
  description: string;
}

class groupsService {
  async getGroups() {
    const groups = await prisma.groups.findMany({
      where: {
        auth_origins: {
          name: 'Локальный',
        },
      },
    });
    return groups;
  }
  async getGroup(id: number) {
    const group = await prisma.groups.findFirst({
      where: {
        AND: [{ auth_origins: { name: 'Локальный' } }, { id }],
      },
    });
    return group;
  }
  async createGroup(groupData: groupDataI) {
    const isAuthOriginExists = await prisma.auth_origins.findFirst({
      where: {
        id: groupData.auth_origin_id,
      },
    });

    if (!isAuthOriginExists) {
      throw APIError.BadRequestError("Auth origin doesn't exist");
    }

    const candidate = await prisma.groups.findFirst({
      where: {
        name: groupData.name,
      },
    });
    if (candidate) {
      throw APIError.BadRequestError('Group already exists');
    }

    const group = await prisma.groups.create({
      data: groupData,
    });
    return group;
  }
  async editGroup(id: number, groupData: groupDataI) {
    const candidate = await prisma.groups.findFirst({
      where: { id },
    });
    if (!candidate) {
      throw APIError.BadRequestError("Group doesn't exist");
    }
    const group = await prisma.groups.update({
      where: { id },
      data: groupData,
    });
    return group;
  }
  async deleteGroup(id: number) {
    const candidate = await prisma.groups.findFirst({
      where: { id },
    });
    if (!candidate) {
      throw APIError.BadRequestError("Group doesn't exist");
    }
    const group = await prisma.groups.delete({
      where: { id },
    });
    return group;
  }
}

export default new groupsService();
