import { Controller, Get, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('delivery-staff/active')
  @UseGuards(AuthGuard)
  async getActiveDeliveryStaff() {
    return this.deliveryService.getActiveDeliveryStaff();
  }

  @Get('delivery-updates')
  @UseGuards(AuthGuard)
  async getDeliveryUpdates() {
    return this.deliveryService.getDeliveryUpdates();
  }
} 