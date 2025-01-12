import { Controller, Get, UseGuards } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('deliveries')
@UseGuards(AuthGuard)
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) {}

  @Get()
  async getAllDeliveries() {
    return this.deliveriesService.findAll();
  }
} 