import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.meals.findMany({
      include: {
        patient: true,
        deliveryStaff: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        deliveryDate: 'desc'
      }
    });
  }
} 