import { prisma } from '../db';
import { APIError } from '../errors';
import { searchParamsI, serviceDataI } from './interfaces';


class servicesService {
  async getServices(searchParams?: searchParamsI) {
    const services = await prisma.services.findMany({
      where: {
        name: {
          contains: searchParams?.search || '',
        },
      },
      take: Number(searchParams?.limit) || 20,
    });
    return services;
  }
  async getService(id: number) {
    const service = await prisma.services.findFirst({
      where: {
        id,
      },
    });
    return service;
  }
  async createService(serviceData: serviceDataI) {
    const candidate = await prisma.services.findFirst({
      where: {
        name: serviceData.name,
      },
    });
    if (candidate) {
      throw APIError.BadRequestError('Service already exists');
    }

    const service = await prisma.services.create({
      data: {
        name: serviceData.name,
      },
    });
    return service;
  }
  async editService(id: number, serviceData: serviceDataI) {
    const candidate = await prisma.services.findFirst({
      where: { id },
    });
    if (!candidate) {
      throw APIError.BadRequestError("Service doesn't exist");
    }
    const service = await prisma.services.update({
      where: { id },
      data: {
        name: serviceData.name,
      },
    });
    return service;
  }
  async deleteService(id: number) {
    const candidate = await prisma.services.findFirst({
      where: { id },
    });
    if (!candidate) {
      throw APIError.BadRequestError("Service doesn't exist");
    }
    const service = await prisma.services.delete({
      where: { id },
    });
    return service;
  }
}

export default new servicesService();
