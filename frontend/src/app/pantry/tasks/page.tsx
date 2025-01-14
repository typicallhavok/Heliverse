"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const DeliveryStatus = {
  PREPARATION: "PREPARATION",
  READY: "READY",
  DELIVERED: "DELIVERED",
} as const;

type DeliveryStatus = (typeof DeliveryStatus)[keyof typeof DeliveryStatus];

type Patient = {
  id: string;
  name: string;
  room: number;
  DietCharts: {
    breakfast: {
      items: string[];
      calories: number;
      restrictions: string;
      nutrients: string;
    };
    lunch: {
      items: string[];
      calories: number;
      restrictions: string;
      nutrients: string;
    };
    dinner: {
      items: string[];
      calories: number;
      restrictions: string;
      nutrients: string;
    };
  }[];
};

type DeliveryStaff = {
  id: string;
  name: string;
  Meals: Meal[];
};

type Meal = {
  id: string;
  name: string;
  patient: Patient;
  patientId: string;
  mealType: string;
  deliveryStatus: DeliveryStatus;
  deliveryDate: string;
  deliveryTime: string;
  pantryStaffId: string;
  deliveryStaff?: {
    id: string;
    name: string;
  };
};

type Pantry = {
  id: string;
  name: string;
};

export default function TasksPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<DeliveryStaff[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("BREAKFAST");
  const [pantries, setPantries] = useState<Pantry[]>([]);
  const [selectedPantry, setSelectedPantry] = useState("");
  const [selectedPatientDietCharts, setSelectedPatientDietCharts] = useState<
    Patient["DietCharts"]
  >([]);
  const [mealName, setMealName] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPantries = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/pantry/staff`
        );
        setPantries(data);
      } catch (error) {
        console.error("Failed to fetch pantries:", error);
      }
    };
    fetchPantries();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, staffRes, mealsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients`),
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/pantry/delivery-staff`
        ),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pantry/tasks`),
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

  const handlePatientSelect = async (patientId: string) => {
    setSelectedPatient(patientId);
    if (patientId) {
      const selectedPatient = patients.find((p) => p.id === patientId);
      setSelectedPatientDietCharts(selectedPatient?.DietCharts || []);
    } else {
      setSelectedPatientDietCharts([]);
    }
  };

  const createMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pantry/tasks`,
        {
          patientId: selectedPatient,
          mealType: selectedMealType,
          pantryId: selectedPantry,
          mealName: mealName,
        },
        { withCredentials: true }
      );
      setMeals([...meals, data]);
      setSelectedPatient("");
      setSelectedPantry("");
      setMealName("");
      setSelectedPatientDietCharts([]);
    } catch (error) {
      console.error("Failed to create meal:", error);
    }
  };

  const assignStaff = async (mealId: string, staffId: string) => {
    try {
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pantry/tasks/${mealId}/assign`,
        { staffId },
        { withCredentials: true }
      );
      setMeals(meals.map((meal) => (meal.id === mealId ? data : meal)));
    } catch (error) {
      console.error("Failed to assign staff:", error);
    }
  };

  const updateStatus = async (mealId: string, status: DeliveryStatus) => {
    try {
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pantry/tasks/${mealId}/status`,
        { status },
        { withCredentials: true }
      );
      setMeals(meals.map((meal) => (meal.id === mealId ? data : meal)));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="space-y-6 p-6">
      {user?.role === "admin" && (
        <>
          <div className="bg-card p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Create New Delivery</h2>
            <form onSubmit={createMeal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Patient
                  </label>
                  <select
                    value={selectedPatient}
                    onChange={(e) => handlePatientSelect(e.target.value)}
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
                  <label className="block text-sm font-medium mb-1">Meal</label>
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full p-2 rounded border bg-background"
                    required
                    placeholder="Enter food to be prepared"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meal Type
                  </label>
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pantry
                  </label>
                  <select
                    value={selectedPantry}
                    onChange={(e) => setSelectedPantry(e.target.value)}
                    className="w-full p-2 rounded border bg-background"
                    required
                  >
                    <option value="">Select Pantry</option>
                    {pantries.map((pantry) => (
                      <option key={pantry.id} value={pantry.id}>
                        {pantry.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedPatientDietCharts.length > 0 && (
                <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">
                    Patient Diet Information
                  </h3>
                  {selectedPatientDietCharts.map((chart, idx) =>
                    selectedMealType === "BREAKFAST" ? (
                      <div key={idx} className="text-sm space-y-1 mb-2">
                        <p className="font-medium">
                          Calories: {chart.breakfast.calories}
                        </p>
                        {chart.breakfast.restrictions.length > 0 && (
                          <p className="text-red-500 text-xs">
                            Restrictions: {chart.breakfast.restrictions}
                          </p>
                        )}
                        {chart.breakfast.nutrients.length > 0 && (
                          <p className="text-green-500 text-xs">
                            Preferences: {chart.breakfast.nutrients}
                          </p>
                        )}
                      </div>
                    ) : selectedMealType === "LUNCH" ? (
                      <div key={idx} className="text-sm space-y-1 mb-2">
                        <p className="font-medium">
                          Calories: {chart.lunch.calories}
                        </p>
                        {chart.lunch.restrictions.length > 0 && (
                          <p className="text-red-500 text-xs">
                            Restrictions: {chart.lunch.restrictions}
                          </p>
                        )}
                        {chart.lunch.nutrients.length > 0 && (
                          <p className="text-green-500 text-xs">
                            Preferences: {chart.lunch.nutrients}
                          </p>
                        )}
                      </div>
                    ) : selectedMealType === "DINNER" ? (
                      <div key={idx} className="text-sm space-y-1 mb-2">
                        <p className="font-medium">
                          Calories: {chart.dinner.calories}
                        </p>
                        {chart.dinner.restrictions.length > 0 && (
                          <p className="text-red-500 text-xs">
                            Restrictions: {chart.dinner.restrictions}
                          </p>
                        )}
                        {chart.dinner.nutrients.length > 0 && (
                          <p className="text-green-500 text-xs">
                            Preferences: {chart.dinner.nutrients}
                          </p>
                        )}
                      </div>
                    ) : null
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground p-2 rounded"
              >
                Create Task
              </button>
            </form>
          </div>
        </>
      )}
      {meals.length === 0 && (
        <div className="text-center text-4xl font-bold">No meals found</div>
      )}
      {meals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["BREAKFAST", "LUNCH", "DINNER"].map((type) => (
            <div key={type} className="space-y-4">
              <h2 className="text-lg font-semibold">{type}</h2>
              <div className="space-y-4">
                {meals
                  .filter((meal) => meal.mealType === type)
                  .map((meal) => (
                    <div
                      key={meal.id}
                      className="bg-card p-4 rounded-lg space-y-3"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{meal.name}</p>
                            <p className="text-sm text-muted">
                              Room {meal.patient.room}
                            </p>
                          </div>
                          <span className="text-sm text-muted">
                            {new Date(meal.deliveryTime).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Patient: </span>
                            {meal.patient.name}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Pantry: </span>
                            {
                              pantries.find(
                                (pantry) => pantry.id === meal.pantryStaffId
                              )?.name
                            }
                          </p>
                          {meal.deliveryStaff && (
                            <p className="text-sm">
                              <span className="font-medium">Delivery: </span>
                              {meal.deliveryStaff.name}
                            </p>
                          )}
                        </div>

                        {patients
                          .find((patient) => patient.id === meal.patientId)
                          ?.DietCharts.map((chart, idx) =>
                            selectedMealType === "BREAKFAST" ? (
                              <div key={idx} className="text-sm space-y-1 mb-2">
                                <p className="font-medium">
                                  Calories: {chart.breakfast.calories}
                                </p>
                                {chart.breakfast.restrictions.length > 0 && (
                                  <p className="text-red-500 text-xs">
                                    Restrictions: {chart.breakfast.restrictions}
                                  </p>
                                )}
                                {chart.breakfast.nutrients.length > 0 && (
                                  <p className="text-green-500 text-xs">
                                    Preferences: {chart.breakfast.nutrients}
                                  </p>
                                )}
                              </div>
                            ) : selectedMealType === "LUNCH" ? (
                              <div key={idx} className="text-sm space-y-1 mb-2">
                                <p className="font-medium">
                                  Calories: {chart.lunch.calories}
                                </p>
                                {chart.lunch.restrictions.length > 0 && (
                                  <p className="text-red-500 text-xs">
                                    Restrictions: {chart.lunch.restrictions}
                                  </p>
                                )}
                                {chart.lunch.nutrients.length > 0 && (
                                  <p className="text-green-500 text-xs">
                                    Preferences: {chart.lunch.nutrients}
                                  </p>
                                )}
                              </div>
                            ) : selectedMealType === "DINNER" ? (
                              <div key={idx} className="text-sm space-y-1 mb-2">
                                <p className="font-medium">
                                  Calories: {chart.dinner.calories}
                                </p>
                                {chart.dinner.restrictions.length > 0 && (
                                  <p className="text-red-500 text-xs">
                                    Restrictions: {chart.dinner.restrictions}
                                  </p>
                                )}
                                {chart.dinner.nutrients.length > 0 && (
                                  <p className="text-green-500 text-xs">
                                    Preferences: {chart.dinner.nutrients}
                                  </p>
                                )}
                              </div>
                            ) : null
                          )}
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
      )}
    </div>
  );
}
