import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PantryMetrics } from '@/types/dashboard';

const PantryPerformance = () => {
    const [metrics, setMetrics] = useState<PantryMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const { data } = await axios.get<PantryMetrics>(`${process.env.BACKEND_URL}/dashboard/pantry-metrics`, {
                    withCredentials: true
                });
                setMetrics(data);
            } catch (err) {
                setError('Failed to fetch pantry metrics');
                console.error('Error fetching pantry metrics:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
        
        const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) return <div>Loading metrics...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!metrics) return null;

    return (
        <div className="col-span-12 lg:col-span-4 bg-card p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Pantry Performance</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/20 p-4 rounded-lg">
                        <p className="text-2xl font-bold">{metrics.onTimeDeliveryRate}%</p>
                        <p className="text-sm text-muted">On-time Delivery</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                        <p className="text-2xl font-bold">{metrics.mealsToday}</p>
                        <p className="text-sm text-muted">Meals Today</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                        <p className="text-2xl font-bold">{metrics.wastageRate}%</p>
                        <p className="text-sm text-muted">Wastage Rate</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                        <p className="text-2xl font-bold">{metrics.totalMealsDelivered}</p>
                        <p className="text-sm text-muted">Total Meals</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PantryPerformance; 