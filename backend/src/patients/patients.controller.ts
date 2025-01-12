import { Controller, Get, UseGuards, Param, Post, Body, Delete } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('patients')
@UseGuards(AuthGuard)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get()
  async getAllPatients() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  async getPatient(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Post()
  async createPatient(@Body() data: CreatePatientDto) {
    return this.patientsService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
} 