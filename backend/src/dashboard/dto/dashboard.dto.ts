export class DietPlanDto {
  name: string;
  patientCount: number;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
}

export class PantryMetricsDto {
  onTimeDeliveryRate: number;
  mealsToday: number;
  wastageRate: number;
  totalMealsDelivered: number;
}

export class DeliveryMetricsDto {
  mealsDeliveredToday: number;
  totalMealsDelivered: number;
  pendingDeliveries: number;
} 