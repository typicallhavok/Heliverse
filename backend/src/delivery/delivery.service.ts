import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async getActiveDeliveryStaff() {
    const staff = await this.prisma.deliveryStaff.findMany({
      include: {
        Meals: {
          where: {
            deliveryStatus: {
              not: 'DELIVERED'
            }
          }
        }
      }
    });

    return staff.map(member => ({
      id: member.id,
      name: member.name,
      assignedMeals: member.Meals.length,
      status: member.Meals.length === 0 ? 'available' : 'delivering'
    }));
  }

  async getDeliveryUpdates() {
    const meals = await this.prisma.meals.findMany({
      take: 10,
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        patient: {
          select: {
            name: true,
            room: true
          }
        },
        deliveryStaff: {
          select: {
            name: true
          }
        }
      }
    });

    return meals.map(meal => ({
      id: meal.id,
      message: this.formatUpdateMessage(meal),
      timestamp: meal.updatedAt,
      type: this.getUpdateType(meal.deliveryStatus)
    }));
  }

  private formatUpdateMessage(meal: any) {
    const staffName = meal.deliveryStaff?.name || 'Unassigned';
    const patientInfo = `Room ${meal.patient.room} (${meal.patient.name})`;
    
    switch (meal.deliveryStatus) {
      case 'PREPARING':
        return `${meal.mealType} meal for ${patientInfo} is being prepared`;
      case 'READY':
        return `${meal.mealType} meal for ${patientInfo} is ready for delivery by ${staffName}`;
      case 'DELIVERED':
        return `${meal.mealType} meal was delivered to ${patientInfo} by ${staffName}`;
      default:
        return `${meal.mealType} meal status updated for ${patientInfo}`;
    }
  }

  private getUpdateType(status: string) {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'READY':
        return 'info';
      case 'PREPARING':
        return 'warning';
      default:
        return 'info';
    }
  }
} 