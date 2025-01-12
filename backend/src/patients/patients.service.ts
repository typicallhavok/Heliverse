import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.patients.findMany({
      include: {
        DietCharts: true
      },
      orderBy: {
        room: 'asc'
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.patients.findUnique({
      where: { id },
      include: {
        DietCharts: true
      }
    });
  }

  async create(data: CreatePatientDto) {
    const { dietChart, ...patientData } = data;

    return this.prisma.$transaction(async (prisma) => {
      const patient = await prisma.patients.create({
        data: patientData
      });

      await prisma.dietCharts.create({
        data: {
          breakfast: dietChart.breakfast,
          lunch: dietChart.lunch,
          dinner: dietChart.dinner,
          patientId: patient.id
        }
      });

      return prisma.patients.findUnique({
        where: { id: patient.id },
        include: {
          DietCharts: true
        }
      });
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.dietCharts.deleteMany({
        where: {
          patientId: id
        }
      });

      return prisma.patients.delete({
        where: { id }
      });
    });
  }
} 