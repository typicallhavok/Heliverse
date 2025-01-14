"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

type Alert = {
    id: string;
    type: string;
    message: string;
    createdAt: string;
    patient: {
        name: string;
        room: number;
    };
};

const Alerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const { data } = await axios.get(`${process.env.BACKEND_URL}/alerts`, {
                    withCredentials: true
                });
                setAlerts(data);
            } catch (error) {
                console.error('Failed to fetch alerts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    if (loading) {
        return (
            <div className="col-span-6 lg:col-span-6 bg-card p-6 rounded-xl">
                <div className="h-6 w-32 bg-secondary/20 rounded mb-4 animate-pulse" />
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-20 bg-secondary/20 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (alerts.length === 0) {
        return (
            <div className="col-span-4 lg:col-span-4 bg-card p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-4">Alerts</h2>
                <div className="bg-secondary/20 p-4 rounded-lg text-center">
                    <p className="text-muted">No active alerts</p>
                </div>
            </div>
        );
    }

    return (
        <div className="col-span-6 lg:col-span-6 bg-card p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Alerts</h2>
            <div className="space-y-4">
                {alerts.map((alert) => (
                    <div key={alert.id} className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                        <p className="text-red-500 font-medium">{alert.type}</p>
                        <p className="text-sm text-muted">{alert.message}</p>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-muted">
                                Patient: {alert.patient.name} (Room {alert.patient.room})
                            </p>
                            <p className="text-sm text-muted">
                                {new Date(alert.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Alerts;