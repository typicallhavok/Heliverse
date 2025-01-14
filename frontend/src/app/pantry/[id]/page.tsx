"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

type PantryStaff = {
  id: string;
  name: string;
  email: string;
  contact: string;
  location: string;
  role: string;
  assignedTasks: string[];
};

export default function PantryStaffDetails() {
  const params = useParams();
  const [staff, setStaff] = useState<PantryStaff | null>(null);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffMember = async () => {
      try {
        const { data } = await axios.get(`${process.env.BACKEND_URL}/pantry/staff/${params.id}`, {
          withCredentials: true,
        });
        setStaff(data);
      } catch (error) {
        console.error("Failed to fetch staff member:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffMember();
  }, [params.id]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const { data } = await axios.post(
        `${process.env.BACKEND_URL}/pantry/staff/${params.id}/tasks`,
        { task: newTask },
        { withCredentials: true }
      );
      setStaff(data);
      setNewTask("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleRemoveTask = async (taskIndex: number) => {
    try {
      const { data } = await axios.delete(
        `${process.env.BACKEND_URL}/pantry/staff/${params.id}/tasks/${taskIndex}`,
        { withCredentials: true }
      );
      setStaff(data);
    } catch (error) {
      console.error("Failed to remove task:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-card animate-pulse rounded" />
        <div className="h-32 bg-card animate-pulse rounded" />
      </div>
    );
  }

  if (!staff) {
    return <div>Staff member not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">{staff.name}</h1>
        <div className="space-y-2">
          <p className="text-muted">Role: {staff.role}</p>
          <p className="text-muted">Location: {staff.location}</p>
          <p className="text-muted">Contact: {staff.contact}</p>
          <p className="text-muted">Email: {staff.email}</p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
        
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="flex-1 p-2 rounded border bg-background"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Add Task
          </button>
        </form>

        {staff.assignedTasks.length === 0 ? (
          <p className="text-muted">No tasks assigned</p>
        ) : (
          <ul className="space-y-2">
            {staff.assignedTasks.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-secondary/20 p-3 rounded"
              >
                <span>{task}</span>
                <button
                  onClick={() => handleRemoveTask(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
