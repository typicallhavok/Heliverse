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
  meals: string[];
};

export default function PantryStaffDetails() {
  const params = useParams();
  const [staff, setStaff] = useState<PantryStaff | null>(null);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffMember = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pantry/staff/${params.id}`, {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pantry/staff/${params.id}/tasks`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pantry/staff/${params.id}/tasks/${taskIndex}`,
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
    </div>
  );
}
