import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.alerts.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        patient: true,
      },
    });
  }
}
