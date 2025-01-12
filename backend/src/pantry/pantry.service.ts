import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryStatus, Prisma } from '@prisma/client';

@Injectable()
export class PantryService {
  constructor(private prisma: PrismaService) {}

  async createMeal(mealData: { patientId: string }) {
    const now = new Date();
    // First find an available staff member
    const availableStaff = await this.prisma.deliveryStaff.findFirst();

    if (!availableStaff) {
      throw new Error('No delivery staff exists in the system');
    }

    return this.prisma.meals.create({
      data: {
        patient: {
          connect: { id: mealData.patientId }
        },
        deliveryStaff: {
          connect: { id: availableStaff.id }
        },
        deliveryDate: now,
        deliveryTime: now,
        deliveryStatus: DeliveryStatus.PREPARATION,
      },
      include: {
        patient: {
          select: {
            name: true,
            room: true,
          },
        },
        deliveryStaff: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getTasks() {
    return this.prisma.meals.findMany({
      include: {
        patient: {
          select: {
            name: true,
            room: true,
          },
        },
        deliveryStaff: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateTaskStatus(id: string, status: DeliveryStatus) {
    try {
      return await this.prisma.meals.update({
        where: { id },
        data: { deliveryStatus: status },
        include: {
          patient: {
            select: {
              name: true,
              room: true,
            },
          },
          deliveryStaff: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }

  async assignDeliveryStaff(id: string, staffId: string) {
    try {
      return await this.prisma.meals.update({
        where: { id },
        data: {
          deliveryStaff: {
            connect: { id: staffId }
          },
          deliveryStatus: DeliveryStatus.PREPARATION,
        },
        include: {
          patient: {
            select: {
              name: true,
              room: true,
            },
          },
          deliveryStaff: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Task or staff member not found');
    }
  }

  async getDeliveryStaff() {
    return this.prisma.deliveryStaff.findMany({
      select: {
        id: true,
        name: true,
        Meals: {
          where: {
            deliveryStatus: {
              not: DeliveryStatus.DELIVERED
            }
          }
        }
      }
    });
  }
} 