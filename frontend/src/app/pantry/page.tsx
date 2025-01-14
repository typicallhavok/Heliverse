"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AddPantryStaffModal from '@/components/AddPantryStaffModal';

type PantryStaff = {
    id: string;
    name: string;
    contact: string;
    location: string;
    role: string;
    assignedTasks: string[];
};

export default function PantryPage() {
    const [staff, setStaff] = useState<PantryStaff[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const { data } = await axios.get(`${process.env.BACKEND_URL}/pantry/staff`, {
                    withCredentials: true,
                });
                setStaff(data);
            } catch (error) {
                console.error("Failed to fetch pantry staff:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    const handleAddStaff = async (staffData: any) => {
        try {
            const { data } = await axios.post(`${process.env.BACKEND_URL}/pantry/staff`, 
                staffData,
                { withCredentials: true }
            );
            setStaff([...staff, data]);
            setShowForm(false);
        } catch (error) {
            console.error('Failed to add staff member:', error);
        }
    };

    const handleDeleteStaff = async (id: string) => {
        if (!confirm('Are you sure you want to remove this staff member?')) {
            return;
        }

        try {
            await axios.delete(`${process.env.BACKEND_URL}/pantry/staff/${id}`, {
                withCredentials: true
            });
            setStaff(staff.filter(member => member.id !== id));
        } catch (error) {
            console.error('Failed to delete staff member:', error);
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

    if (staff.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <h1 className="text-2xl font-bold text-muted-foreground">
                    No Pantry Staff Found
                </h1>
                <p className="text-muted mt-2">
                    There are currently no staff members in the system.
                </p>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary text-primary-foreground w-12 h-12 rounded-full hover:bg-primary/90 text-2xl font-semibold flex items-center justify-center mt-4"
                >
                    +
                </button>
                <AddPantryStaffModal 
                    show={showForm}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleAddStaff}
                />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Pantry Staff</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-primary text-primary-foreground w-12 h-12 rounded-full hover:bg-primary/90 text-2xl font-semibold flex items-center justify-center"
                    >
                        +
                    </button>
                </div>

                {staff.map((member) => (
                    <div
                        key={member.id}
                        className="bg-card p-6 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-semibold">{member.name}</h2>
                                <p className="text-sm text-muted">
                                    {member.role} • {member.location}
                                </p>
                                <p className="text-sm text-muted mt-1">
                                    Contact: {member.contact}
                                </p>
                                {member.assignedTasks.length > 0 && (
                                    <p className="text-sm text-muted mt-1">
                                        Current Tasks: {member.assignedTasks.join(", ")}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push(`/pantry/${member.id}`)}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Manage
                                </button>
                                <button
                                    onClick={() => handleDeleteStaff(member.id)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <AddPantryStaffModal 
                show={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleAddStaff}
            />
        </>
    );
}
