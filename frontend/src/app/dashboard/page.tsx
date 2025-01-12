"use client";
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import PantryDashboard from '@/components/dashboard/PantryDashboard';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-full bg-background p-6">
                <div className="animate-pulse">
                    <div className="h-8 w-48 bg-card rounded mb-4" />
                    <div className="h-4 w-32 bg-card rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-full bg-background p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h1>
                <p className="text-muted">Hospital Food Management System - {user?.role}</p>
            </div>

            {user?.role === 'admin' && <AdminDashboard />}
            {user?.role === 'pantry' && <PantryDashboard />}
        </div>
    );
};

export default Dashboard;