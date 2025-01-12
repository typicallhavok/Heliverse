"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const DeliveryStatus = {
  PREPARATION: 'PREPARATION',
  READY: 'READY',
  DELIVERED: 'DELIVERED'
} as const;

type DeliveryStatus = typeof DeliveryStatus[keyof typeof DeliveryStatus];

type Patient = {
  id: string;
  name: string;
  room: number;
};

type DeliveryStaff = {
  id: string;
  name: string;
  Meals: any[];
};

type Meal = {
  id: string;
  patient: Patient;
  mealType: string;
  deliveryStatus: DeliveryStatus;
  deliveryStaff?: {
    id: string;
    name: string;
  };
};

export default function TasksPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<DeliveryStaff[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("BREAKFAST");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, staffRes, mealsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/patients"),
        axios.get("http://localhost:3001/api/pantry/delivery-staff"),
        axios.get("http://localhost:3001/api/pantry/tasks"),
      ]);
      setPatients(patientsRes.data);
      setStaff(staffRes.data);
      setMeals(mealsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/pantry/tasks",
        {
          patientId: selectedPatient,
          mealType: selectedMealType,
        },
        { withCredentials: true }
      );
      setMeals([data, ...meals]);
      setSelectedPatient("");
    } catch (error) {
      console.error("Failed to create meal:", error);
    }
  };

  const assignStaff = async (mealId: string, staffId: string) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3001/api/pantry/tasks/${mealId}/assign`,
        { staffId },
        { withCredentials: true }
      );
      setMeals(meals.map(meal => meal.id === mealId ? data : meal));
    } catch (error) {
      console.error("Failed to assign staff:", error);
    }
  };

  const updateStatus = async (mealId: string, status: DeliveryStatus) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3001/api/pantry/tasks/${mealId}/status`,
        { status },
        { withCredentials: true }
      );
      setMeals(meals.map(meal => meal.id === mealId ? data : meal));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="bg-card p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Create New Delivery</h2>
        <form onSubmit={createMeal} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full p-2 rounded border bg-background"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (Room {patient.room})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meal Type</label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full p-2 rounded border bg-background"
                required
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground p-2 rounded"
          >
            Create Delivery Task
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["BREAKFAST", "LUNCH", "DINNER"].map((type) => (
          <div key={type} className="space-y-4">
            <h2 className="text-lg font-semibold">{type}</h2>
            <div className="space-y-4">
              {meals
                .filter((meal) => meal.mealType === type)
                .map((meal) => (
                  <div key={meal.id} className="bg-card p-4 rounded-lg space-y-3">
                    <div>
                      <p className="font-medium">
                        {meal.patient.name}
                      </p>
                      <p className="text-sm text-muted">
                        Room {meal.patient.room}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <select
                        value={meal.deliveryStaff?.id || ""}
                        onChange={(e) => assignStaff(meal.id, e.target.value)}
                        className="w-full p-2 text-sm rounded border bg-background"
                      >
                        <option value="">Assign Staff</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-2">
                        {Object.values(DeliveryStatus).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(meal.id, status)}
                            className={`flex-1 px-2 py-1 rounded text-xs ${
                              meal.deliveryStatus === status
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
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