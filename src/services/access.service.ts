import { prisma } from '../db';
import { APIError } from '../errors';
import { accessDataI } from './interfaces';

class accessService {
  async addAccessRights(accessData: accessDataI) {
    const candidateModule = await prisma.modules.findFirst({
      where: { id: accessData.module_id },
    });
    if (!candidateModule) {
      throw APIError.BadRequestError("Module doesn't exist");
    }
    const candidateGroup = await prisma.groups.findFirst({
      where: { id: accessData.group_id },
    });
    if (!candidateGroup && accessData.group_id) {
      throw APIError.BadRequestError("Group doesn't exist");
    }
    const candidateUser = await prisma.users.findFirst({
      where: { id: accessData.user_id },
    });
    if (!candidateUser && accessData.user_id) {
      throw APIError.BadRequestError("User doesn't exist");
    }
    const accessRights = await prisma.access_rights.create({
      data: {
        module_id: accessData.module_id,
        group_id: accessData.group_id,
        user_id: accessData.user_id,
      },
    });
    return accessRights;
  }
  async deleteAccessRights(accessData: accessDataI) {
    const candidate = await prisma.access_rights.findFirst({
      where: {
        AND: [
          { module_id: accessData.module_id },
          { user_id: accessData.user_id },
          { group_id: accessData.group_id },
        ],
      },
    });
    if (!candidate) {
      throw APIError.BadRequestError("Access right doesn't exist");
    }
    const accessRights = await prisma.access_rights.deleteMany({
      where: {
        AND: [
          { module_id: accessData.module_id },
          { user_id: accessData.user_id },
          { group_id: accessData.group_id },
        ],
      },
    });
    return accessRights;
  }
  async getAccessRightsForModule(id: number) {
    const candidate = await prisma.modules.findFirst({
      where: { id },
    });
    if (!candidate) {
      throw APIError.BadRequestError("Module doesn't exist");
    }
    const accessRights = await prisma.access_rights.findMany({
      where: {
        module_id: id,
      },
    });
    return accessRights;
  }
}

export default new accessService();
