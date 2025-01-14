import { useState, useEffect } from 'react';
import axios from 'axios';
import type { DietPlan } from '@/types/dashboard';

const DietCharts = () => {
    const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDietPlans = async () => {
            try {

                const { data } = await axios.get<DietPlan[]>(`${process.env.BACKEND_URL}/dashboard/diet-plans`, {
                    withCredentials: true
                });
                setDietPlans(data);
            } catch (err) {
                setError('Failed to fetch diet plans');
                console.error('Error fetching diet plans:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDietPlans();
    }, []);

    if (isLoading) {
        return (
            <div className="col-span-12 lg:col-span-4 bg-card p-6 rounded-xl">
                <div className="h-6 w-32 bg-secondary/20 rounded mb-4 animate-pulse" />
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-20 bg-secondary/20 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="col-span-12 lg:col-span-4 bg-card p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Diet Charts</h2>
            <div className="space-y-4">
                {dietPlans.map((plan, index) => (
                    <div key={index} className="bg-secondary/20 p-4 rounded-lg">
                        <h3 className="font-medium">{plan.name}</h3>
                        <p className="text-sm text-muted mb-2">{plan.patientCount} patients</p>
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm font-medium">Breakfast:</p>
                                <p className="text-sm text-muted">{plan.meals.breakfast.join(", ")}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Lunch:</p>
                                <p className="text-sm text-muted">{plan.meals.lunch.join(", ")}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Dinner:</p>
                                <p className="text-sm text-muted">{plan.meals.dinner.join(", ")}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DietCharts; 