import { prisma } from '../db';
import { APIError } from '../errors';

interface serviceDataI {
  name: string;
}

class servicesService {
  async getServices() {
    const services = await prisma.services.findMany();
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
      data: serviceData,
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
      data: serviceData,
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
