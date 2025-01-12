"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Staff = {
  id: string;
  name: string;
  assignedMeals: number;
  status: string;
};

const DeliveryStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/delivery-staff/active",
          {
            withCredentials: true,
          }
        );
        setStaff(data);
      } catch (error) {
        console.error("Failed to fetch delivery staff:", error);
      }
    };
    fetchStaff();
  }, []);

  if (staff.length === 0) {
    return (
      <div className="col-span-12 lg:col-span-4 bg-card p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Active Delivery Staff</h2>
        <p className="text-sm text-muted">No active delivery staff</p>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-4 bg-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Active Delivery Staff</h2>
      <div className="space-y-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted">
                Assigned: {member.assignedMeals} meals
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                member.status === "available"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-yellow-500/10 text-yellow-500"
              }`}
            >
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryStaff;
