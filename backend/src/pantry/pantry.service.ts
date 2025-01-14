import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryStatus, Prisma } from '@prisma/client';

@Injectable()
export class PantryService {
  constructor(private prisma: PrismaService) {}

  async createMeal(mealData: { patientId: string, mealName: string, mealType: string, pantryId: string }) {
    const now = new Date();
    const availableStaff = await this.prisma.deliveryStaff.findFirst();

    if (!availableStaff) {
      throw new Error('No delivery staff exists in the system');
    }

    return this.prisma.meals.create({
      data: {
        name: mealData.mealName,
        patient: {
          connect: { id: mealData.patientId },
        },
        deliveryStaff: {
          connect: { id: availableStaff.id },
        },
        deliveryDate: now,
        deliveryTime: now,
        deliveryStatus: DeliveryStatus.PREPARATION,
        mealType: mealData.mealType,
        pantryStaff: {
          connect: { id: mealData.pantryId },
        },
        
        
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

  async getStaff() {
    return this.prisma.pantryStaff.findMany();
  }

  async getStaffById(id: string) {
    return this.prisma.pantryStaff.findUnique({
      where: { id },
    });
  }

  async createTask(id: string, taskData: { patientId: string, mealName: string, mealType: string, pantryId: string }) {
    const now = new Date();
    return this.prisma.meals.create({
      data: {
        name: taskData.mealName,
        patient: { connect: { id: taskData.patientId } },
        deliveryStaff: { connect: { id } },
        deliveryDate: now,
        deliveryTime: now,
        deliveryStatus: DeliveryStatus.PREPARATION,
        mealType: taskData.mealType,
        pantryStaff: { connect: { id: taskData.pantryId } },
      },

    });
  }

  async updateTaskStatus(id: string, status: DeliveryStatus) {
    try {
      return await this.prisma.meals.update({
        where: { id },
        data: { deliveryStatus: DeliveryStatus[status] },
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
      console.error('Update error:', error);
      throw new NotFoundException('Task not found');
    }
  }

  async assignDeliveryStaff(id: string, staffId: string) {
    try {
      return await this.prisma.meals.update({
        where: { id },
        data: {
          deliveryStaff: {
            connect: { id: staffId },
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
              not: DeliveryStatus.DELIVERED,
            },
          },
        },
      },
    });
  }
}
