import { prisma } from '../db';
import { APIError } from '../errors';
import { moduleDataI, searchParamsI } from './interfaces';


class modulesService {
  async getModules(serviceId: number, searchParams?: searchParamsI) {
    const modules = await prisma.modules.findMany({
      where: {
        service_id: serviceId,
        name: { contains: searchParams?.search },
      },
      take: Number(searchParams?.limit) || 20,
    });
    return modules;
  }
  async getModule(id: number) {
    const module = await prisma.modules.findFirst({
      where: {
        id,
      },
    });
    return module;
  }
  async createModule(moduleData: moduleDataI) {
    const candidate = await prisma.modules.findFirst({
      where: {
        AND: [{ name: moduleData.name }, { service_id: moduleData.service_id }],
      },
    });
    if (candidate) {
      throw APIError.BadRequestError('Module already exists');
    }

    const isServiceExists = await prisma.services.findFirst({
      where: {
        id: moduleData.service_id,
      },
    });

    if (!isServiceExists) {
      throw APIError.BadRequestError("Service doesn't exists");
    }

    const module = await prisma.modules.create({
      data: {
        name: moduleData.name,
        service_id: moduleData.service_id,
      },
    });
    return module;
  }
  async editModule(id: number, moduleData: moduleDataI) {
    const candidate = await prisma.modules.findFirst({
      where: { id },
    });
    if (!candidate) {
      throw APIError.BadRequestError("Module doesn't exist");
    }
    const module = await prisma.modules.update({
      where: { id },
      data: {
        name: moduleData.name,
        service_id: moduleData.service_id,
      },
    });
    return module;
  }
  async deleteModule(id: number) {
    const candidate = await prisma.modules.findFirst({
      where: { id },
    });
    if (!candidate) {
      throw APIError.BadRequestError("Module doesn't exist");
    }
    const module = await prisma.modules.delete({
      where: { id },
    });
    return module;
  }
}

export default new modulesService();
