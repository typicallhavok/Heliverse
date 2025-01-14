import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DietPlanDto, PantryMetricsDto, DeliveryMetricsDto } from './dto/dashboard.dto';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDietPlans(): Promise<DietPlanDto[]> {
    const dietCharts = await this.prisma.dietCharts.findMany({
      include: {
        patient: true,
      },
    });

    // Group diet charts by similar meal plans
    const dietPlans = new Map<string, DietPlanDto>();
    
    for (const chart of dietCharts) {
      const key = JSON.stringify({ breakfast: chart.breakfast, lunch: chart.lunch, dinner: chart.dinner });
      
      // Extract items from the meal objects
      const extractMealInfo = (meal: any) => {
        if (typeof meal === 'string') {
          try {
            meal = JSON.parse(meal);
          } catch (e) {
            return { items: [meal] };
          }
        }
        
        // If it's already in the correct format
        if (meal && meal.items) {
          return meal;
        }

        // Convert to correct format if it's not
        return {
          items: Array.isArray(meal) ? meal : [String(meal)],
          calories: meal?.calories
        };
      };

      if (!dietPlans.has(key)) {
        dietPlans.set(key, {
          name: `Diet Plan ${dietPlans.size + 1}`,
          patientCount: 1,
          meals: {
            breakfast: extractMealInfo(chart.breakfast).items,
            lunch: extractMealInfo(chart.lunch).items,
            dinner: extractMealInfo(chart.dinner).items,
          },
        });
      } else {
        const plan = dietPlans.get(key)!;
        plan.patientCount++;
      }
    }

    return Array.from(dietPlans.values());
  }

  async getPantryMetrics(): Promise<PantryMetricsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get meals delivered today
    const mealsToday = await this.prisma.meals.count({
      where: {
        deliveryDate: {
          gte: today,
        },
        deliveryStatus: DeliveryStatus.DELIVERED,
      },
    });

    // Calculate on-time delivery rate
    const totalDelivered = await this.prisma.meals.count({
      where: {
        deliveryStatus: DeliveryStatus.DELIVERED,
      },
    });

    const onTimeDeliveries = await this.prisma.meals.count({
      where: {
        deliveryStatus: DeliveryStatus.DELIVERED,
        deliveryTime: {
          gte: new Date(new Date().getTime() - 15 * 60000), // Within 15 minutes of scheduled time
        },
      },
    });

    // Calculate wastage rate (cancelled meals)
    const cancelledMeals = await this.prisma.meals.count({
      where: {
        deliveryStatus: DeliveryStatus.CANCELLED,
      },
    });

    const totalMeals = await this.prisma.meals.count();
    const wastageRate = totalMeals > 0 ? (cancelledMeals / totalMeals) * 100 : 0;

    return {
      onTimeDeliveryRate: totalDelivered > 0 ? (onTimeDeliveries / totalDelivered) * 100 : 0,
      mealsToday,
      wastageRate: Math.round(wastageRate * 10) / 10,
      totalMealsDelivered: totalDelivered,
    };
  }

  async getDeliveryMetrics(userId: string): Promise<DeliveryMetricsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mealsDeliveredToday = await this.prisma.meals.count({
      where: {
        deliveryStaffId: userId,
        deliveryDate: {
          gte: today,
        },
        deliveryStatus: DeliveryStatus.DELIVERED,
      },
    });

    const totalMealsDelivered = await this.prisma.meals.count({
      where: {
        deliveryStaffId: userId,
        deliveryStatus: DeliveryStatus.DELIVERED,
      },
    });

    const pendingDeliveries = await this.prisma.meals.count({
      where: {
        deliveryStaffId: userId,
        deliveryStatus: {
          not: DeliveryStatus.DELIVERED,
        },
      },
    });

    return {
      mealsDeliveredToday,
      totalMealsDelivered,
      pendingDeliveries,
    };
  }
} 