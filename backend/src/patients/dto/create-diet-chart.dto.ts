type MealDetails = {
  items: string[];
  calories: number;
  restrictions: string;
};

export class CreateDietChartDto {
  breakfast: MealDetails;
  lunch: MealDetails;
  dinner: MealDetails;
} 