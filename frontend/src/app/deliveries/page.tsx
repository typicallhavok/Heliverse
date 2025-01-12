"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Delivery = {
  id: string;
  patient: {
    name: string;
    room: number;
  };
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
  deliveryStatus: "PREPARING" | "READY" | "DELIVERED";
  deliveryStaff?: {
    name: string;
  };
  createdAt: string;
};

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/deliveries", {
        withCredentials: true,
      });
      setDeliveries(data);
    } catch (error) {
      console.error("Failed to fetch deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (
    id: string,
    status: "PREPARING" | "READY" | "DELIVERED"
  ) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3001/api/deliveries/${id}/status`,
        { status },
        { withCredentials: true }
      );
      setDeliveries(deliveries.map((d) => (d.id === id ? data : d)));
    } catch (error) {
      console.error("Failed to update delivery status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PREPARING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "READY":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "DELIVERED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-secondary/20 text-muted border-secondary/20";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card animate-pulse h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (deliveries.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">No deliveries found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meal Deliveries</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["BREAKFAST", "LUNCH", "DINNER"].map((mealType) => (
          <div key={mealType} className="space-y-4">
            <h2 className="text-lg font-semibold capitalize">
              {mealType.toLowerCase()}
            </h2>
            <div className="space-y-3">
              {deliveries
                .filter((d) => d.mealType === mealType)
                .map((delivery) => (
                  <div
                    key={delivery.id}
                    className="bg-card p-4 rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{delivery.patient.name}</p>
                        <p className="text-sm text-muted">
                          Room {delivery.patient.room}
                        </p>
                        {delivery.deliveryStaff && (
                          <p className="text-sm text-muted">
                            Assigned to: {delivery.deliveryStaff.name}
                          </p>
                        )}
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                          delivery.deliveryStatus
                        )}`}
                      >
                        {delivery.deliveryStatus.toLowerCase()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateDeliveryStatus(delivery.id, "PREPARING")
                        }
                        className={`flex-1 px-2 py-1 rounded text-xs ${
                          delivery.deliveryStatus === "PREPARING"
                            ? "bg-yellow-500 text-white"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        Preparing
                      </button>
                      <button
                        onClick={() =>
                          updateDeliveryStatus(delivery.id, "READY")
                        }
                        className={`flex-1 px-2 py-1 rounded text-xs ${
                          delivery.deliveryStatus === "READY"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        Ready
                      </button>
                      <button
                        onClick={() =>
                          updateDeliveryStatus(delivery.id, "DELIVERED")
                        }
                        className={`flex-1 px-2 py-1 rounded text-xs ${
                          delivery.deliveryStatus === "DELIVERED"
                            ? "bg-green-500 text-white"
                            : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
