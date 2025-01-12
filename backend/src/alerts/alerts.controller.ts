import { Controller, Get, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('alerts')
@UseGuards(AuthGuard)
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Get()
  async getAllAlerts() {
    return this.alertsService.findAll();
  }
}
