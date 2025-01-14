import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { PantryService } from './pantry.service';
import { AuthGuard } from '../auth/auth.guard';
import { DeliveryStatus } from '@prisma/client';

@Controller('pantry')
@UseGuards(AuthGuard)
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Post('tasks')
  async createMeal(@Body() mealData: { patientId: string, mealName: string, mealType: string, pantryId: string }) {
    return this.pantryService.createMeal(mealData);
  }

  @Get('tasks')
  async getTasks() {
    return this.pantryService.getTasks();
  }
  
  @Get('delivery-staff')
  async getDeliveryStaff() {
    return this.pantryService.getDeliveryStaff();
  }

  @Get("staff")
  async getStaff() {
    return this.pantryService.getStaff();
  }

  @Get("staff/:id")
  async getStaffById(@Param("id") id: string) {
    return this.pantryService.getStaffById(id);
  }

  @Post("staff/:id/tasks")
  async createTask(@Param("id") id: string, @Body() taskData: { patientId: string, mealName: string, mealType: string, pantryId: string }) {
    return this.pantryService.createTask(id, taskData);
  }

  @Patch('tasks/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: DeliveryStatus,
  ) {
    return this.pantryService.updateTaskStatus(id, status);
  }

  @Patch('tasks/:id/assign')
  async assignDeliveryStaff(
    @Param('id') id: string,
    @Body('staffId') staffId: string,
  ) {
    return this.pantryService.assignDeliveryStaff(id, staffId);
  }
} 