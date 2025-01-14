import { useState, useEffect } from 'react';
import axios from 'axios';

interface DeliveryMetrics {
  mealsDeliveredToday: number;
  totalMealsDelivered: number;
  pendingDeliveries: number;
}

const DeliveryDashboard = () => {
  const [metrics, setMetrics] = useState<DeliveryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await axios.get<DeliveryMetrics>(
          `${process.env.BACKEND_URL}/dashboard/delivery-metrics`,
          { withCredentials: true }
        );
        setMetrics(data);
      } catch (err) {
        setError('Failed to fetch delivery metrics');
        console.error('Error fetching delivery metrics:', err);
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
      <h2 className="text-lg font-semibold mb-4">Delivery Performance</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-secondary/20 p-4 rounded-lg">
          <p className="text-2xl font-bold">{metrics.mealsDeliveredToday}</p>
          <p className="text-sm text-muted">Delivered Today</p>
        </div>
        <div className="bg-secondary/20 p-4 rounded-lg">
          <p className="text-2xl font-bold">{metrics.totalMealsDelivered}</p>
          <p className="text-sm text-muted">Total Delivered</p>
        </div>
        <div className="bg-secondary/20 p-4 rounded-lg">
          <p className="text-2xl font-bold">{metrics.pendingDeliveries}</p>
          <p className="text-sm text-muted">Pending</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;