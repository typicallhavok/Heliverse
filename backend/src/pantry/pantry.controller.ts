import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PantryService } from './pantry.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('pantry')
@UseGuards(AuthGuard)
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Get('staff')
  async getAllStaff() {
    return this.pantryService.getAllStaff();
  }

  @Get('staff/:id')
  async getStaffById(@Param('id') id: string) {
    return this.pantryService.getStaffById(id);
  }

  @Post('staff')
  async createStaff(@Body() staffData: any) {
    return this.pantryService.createStaff(staffData);
  }

  @Put('staff/:id')
  async updateStaff(
    @Param('id') id: string,
    @Body() staffData: any,
  ) {
    return this.pantryService.updateStaff(id, staffData);
  }

  @Delete('staff/:id')
  async deleteStaff(@Param('id') id: string) {
    return this.pantryService.deleteStaff(id);
  }

  @Post('staff/:id/tasks')
  async addTask(
    @Param('id') id: string,
    @Body('task') task: string,
  ) {
    return this.pantryService.addTask(id, task);
  }

  @Delete('staff/:id/tasks/:taskIndex')
  async removeTask(
    @Param('id') id: string,
    @Param('taskIndex') taskIndex: string,
  ) {
    return this.pantryService.removeTask(id, parseInt(taskIndex));
  }
} 