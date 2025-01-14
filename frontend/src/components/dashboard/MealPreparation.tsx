"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

type Meal = {
  id: string;
  patient: {
    name: string;
    room: number;
  };
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  deliveryStatus: 'PREPARATION' | 'READY' | 'DELIVERED';
};

const MealPreparation = () => {
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/deliveries`, {
          withCredentials: true,
        });
        setMeals(data);
      } catch (error) {
        console.error('Failed to fetch meals:', error);
      }
    };
    fetchMeals();
  }, []);

  return (
    <div className="col-span-12 lg:col-span-8 bg-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Meal Preparation Status</h2>
      <div className="grid grid-cols-3 gap-4">
        {['BREAKFAST', 'LUNCH', 'DINNER'].map((type) => (
          <div key={type} className="space-y-2">
            <h3 className="font-medium capitalize">{type.toLowerCase()}</h3>
            <div className="text-2xl font-bold">
              {meals.filter((m) => m.mealType === type).length}
            </div>
            <div className="text-sm text-muted">
              Preparing: {meals.filter((m) => m.mealType === type && m.deliveryStatus === 'PREPARATION').length}
              <br />
              Ready: {meals.filter((m) => m.mealType === type && m.deliveryStatus === 'READY').length}
              <br />
              Delivered: {meals.filter((m) => m.mealType === type && m.deliveryStatus === 'DELIVERED').length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPreparation; 