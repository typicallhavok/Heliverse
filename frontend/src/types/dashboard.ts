export interface DietPlan {
    name: string;
    patientCount: number;
    meals: {
        breakfast: string[];
        lunch: string[];
        dinner: string[];
    };
}

export interface PantryMetrics {
    onTimeDeliveryRate: number;
    mealsToday: number;
    wastageRate: number;
    totalMealsDelivered: number;
} 