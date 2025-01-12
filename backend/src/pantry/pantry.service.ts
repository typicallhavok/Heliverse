import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PantryService {
  constructor(private prisma: PrismaService) {}

  async getAllStaff() {
    return this.prisma.pantryStaff.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        location: true,
        role: true,
        assignedTasks: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from the response
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getStaffById(id: string) {
    const staff = await this.prisma.pantryStaff.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        location: true,
        role: true,
        assignedTasks: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from the response
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return staff;
  }

  async createStaff(staffData: any) {
    // Check if email already exists
    const existingStaff = await this.prisma.pantryStaff.findUnique({
      where: { email: staffData.email },
    });

    if (existingStaff) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(staffData.password, 10);

    // Create staff with hashed password
    const newStaff = await this.prisma.pantryStaff.create({
      data: {
        ...staffData,
        password: hashedPassword,
        assignedTasks: [], // Initialize empty tasks array
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        location: true,
        role: true,
        assignedTasks: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from the response
      },
    });

    return newStaff;
  }

  async updateStaff(id: string, staffData: any) {
    // If updating email, check if it already exists
    if (staffData.email) {
      const existingStaff = await this.prisma.pantryStaff.findFirst({
        where: {
          email: staffData.email,
          NOT: {
            id: id
          }
        },
      });

      if (existingStaff) {
        throw new ConflictException('Email already exists');
      }
    }

    // If updating password, hash it
    if (staffData.password) {
      staffData.password = await bcrypt.hash(staffData.password, 10);
    }

    try {
      return await this.prisma.pantryStaff.update({
        where: { id },
        data: staffData,
        select: {
          id: true,
          name: true,
          email: true,
          contact: true,
          location: true,
          role: true,
          assignedTasks: true,
          createdAt: true,
          updatedAt: true,
          // Exclude password from the response
        },
      });
    } catch (error) {
      throw new NotFoundException('Staff member not found');
    }
  }

  async deleteStaff(id: string) {
    try {
      await this.prisma.pantryStaff.delete({
        where: { id },
      });
      return { message: 'Staff member deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Staff member not found');
    }
  }

  async addTask(id: string, task: string) {
    const staff = await this.prisma.pantryStaff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return this.prisma.pantryStaff.update({
      where: { id },
      data: {
        assignedTasks: {
          push: task,
        },
      },
    });
  }

  async removeTask(id: string, taskIndex: number) {
    const staff = await this.prisma.pantryStaff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    const updatedTasks = staff.assignedTasks.filter((_, index) => index !== taskIndex);

    return this.prisma.pantryStaff.update({
      where: { id },
      data: {
        assignedTasks: updatedTasks,
      },
    });
  }
} 