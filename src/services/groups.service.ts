import { prisma } from '../db';
import { APIError } from '../errors';

interface groupDataI {
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
      include: {
        access_rights: true,
        users_groups: true,
      },
    });
    return groups;
  }
  async getGroup(id: number) {
    const group = await prisma.groups.findFirst({
      where: {
        AND: [{ auth_origins: { name: 'Локальный' } }, { id }],
      },
      include: {
        access_rights: true,
        users_groups: true,
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
