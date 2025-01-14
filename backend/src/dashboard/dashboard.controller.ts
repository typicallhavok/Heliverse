import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/auth.guard';
import { DietPlanDto, PantryMetricsDto } from './dto/dashboard.dto';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('diet-plans')
  async getDietPlans(): Promise<DietPlanDto[]> {
    return this.dashboardService.getDietPlans();
  }

  @Get('pantry-metrics')
  async getPantryMetrics(): Promise<PantryMetricsDto> {
    return this.dashboardService.getPantryMetrics();
  }

  @Get('delivery-metrics')
  @UseGuards(AuthGuard)
  async getDeliveryMetrics(@Request() req) {
    return this.dashboardService.getDeliveryMetrics(req.user.id);
  }
} 