"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Update = {
  id: string;
  message: string;
  timestamp: string;
  type: "success" | "warning" | "info";
};

const DeliveryUpdates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/delivery-updates`,
          {
            withCredentials: true,
          }
        );
        setUpdates(data);
      } catch (error) {
        console.error("Failed to fetch updates:", error);
      }
    };
    fetchUpdates();
  }, []);

  if (updates.length === 0) {
    return (
      <div className="col-span-12 bg-card p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
        <p className="text-sm text-muted">No updates available</p>
      </div>
    );
  }

  return (
    <div className="col-span-12 bg-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className={`p-4 rounded-lg border ${
              update.type === "success"
                ? "bg-green-500/10 border-green-500/20"
                : update.type === "warning"
                ? "bg-yellow-500/10 border-yellow-500/20"
                : "bg-blue-500/10 border-blue-500/20"
            }`}
          >
            <p className="text-sm">{update.message}</p>
            <p className="text-xs text-muted mt-1">
              {new Date(update.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryUpdates;
