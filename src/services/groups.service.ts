import { prisma } from '../db';
import { APIError } from '../errors';
import { groupDataI, searchParamsI } from './interfaces';

class groupsService {
  async getGroups(searchParams?: searchParamsI) {
    const groups = await prisma.groups.findMany({
      where: {
        auth_origins: {
          name: 'Локальный',
        },
        name: {
          contains: searchParams?.search || '',
        },
      },
      take: Number(searchParams?.limit) || 20,
    });
    return groups;
  }
  async getGroup(id: number) {
    const group = await prisma.groups.findFirst({
      where: {
        AND: [{ auth_origins: { name: 'Локальный' } }, { id }],
      },
      include: {
        users_groups: {
          select: {
            users: true,
          },
        },
      },
    });
    return group;
  }
  async createGroup(groupData: groupDataI) {
    const authOrigin = await prisma.auth_origins.findFirst({
      where: {
        name: 'Локальный',
      },
    });

    if (!authOrigin) {
      throw APIError.BadRequestError("Auth origin 'Локальный' doesn't exist");
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
      data: {
        name: groupData.name,
        description: groupData.description,
        comment: groupData.comment,
        auth_origin_id: authOrigin.id,
      },
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
      data: {
        name: groupData.name,
        description: groupData.description,
        comment: groupData.comment,
      },
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
  async addUserToGroup(groupId: number, userId: number) {
    const candidateGroup = await prisma.groups.findFirst({
      where: { id: groupId },
    });
    if (!candidateGroup) {
      throw APIError.BadRequestError("Group doesn't exist");
    }
    const candidateUser = await prisma.users.findFirst({
      where: { id: userId },
    });
    if (!candidateUser) {
      throw APIError.BadRequestError("User doesn't exist");
    }

    const userGroupData = await prisma.users_groups.create({
      data: { user_id: userId, group_id: groupId },
    });
    return userGroupData;
  }
  async deleteUserFromGroup(id: number) {
    const candidate = await prisma.users_groups.findFirst({
      where: { id },
    });
    if (!candidate) {
      throw APIError.BadRequestError("Relation doesn't exist");
    }

    const userGroupData = await prisma.users_groups.delete({
      where: { id },
    });
    return userGroupData;
  }
}

export default new groupsService();
