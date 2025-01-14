"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Delivery = {
	id: string;
	deliveryDate: string;
	deliveryTime: string;
	deliveryStatus: string;
	patient: {
		name: string;
		room: number;
		bed: number;
	};
	deliveryStaff: {
		name: string;
	};
};

const FoodDeliveries = () => {
	const [deliveries, setDeliveries] = useState<Delivery[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDeliveries = async () => {
			try {
				const { data } = await axios.get(
					`${process.env.BACKEND_URL}/deliveries`,
					{
						withCredentials: true,
					}
				);
				setDeliveries(data);
			} catch (error) {
				console.error("Failed to fetch deliveries:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDeliveries();
		console.log(deliveries);
	}, []);

	if (loading) {
		return (
			<div className="col-span-12 lg:col-span-8 bg-card p-6 rounded-xl animate-pulse">
				<div className="h-6 w-32 bg-secondary/20 rounded mb-4" />
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-20 bg-secondary/20 rounded-lg" />
					))}
				</div>
			</div>
		);
	}

	if (deliveries.length === 0) {
		return (
			<div className="col-span-12 lg:col-span-8 bg-card p-6 rounded-xl">
				<p className="text-muted">No deliveries found</p>
			</div>
		);
	}

	return (
		<div className="col-span-12 lg:col-span-8 bg-card p-6 rounded-xl">
			<h2 className="text-lg font-semibold mb-4">Food Deliveries</h2>
			<div className="space-y-4">
				{deliveries.map((delivery) => (
					<div
						key={delivery.id}
						className="bg-secondary/20 p-4 rounded-lg flex justify-between items-center"
					>
						<div>
							<p className="font-medium">
								Room {delivery.patient.room} - Bed {delivery.patient.bed}
							</p>
							<p className="text-sm text-muted">
								Patient: {delivery.patient.name}
							</p>
							<p className="text-sm text-muted">
								Staff: {delivery.deliveryStaff.name}
							</p>
						</div>
						<div className="text-right">
							<span
								className={`px-3 py-1 rounded-full text-sm
                                ${
																	delivery.deliveryStatus === "DELIVERED"
																		? "bg-green-500/20 text-green-500"
																		: delivery.deliveryStatus === "PREPARATION"
																		? "bg-yellow-500/20 text-yellow-500"
																		: "bg-blue-500/20 text-blue-500"
																}`}
							>
								{delivery.deliveryStatus}
							</span>
							<p className="text-sm text-muted mt-1">
								{new Date(delivery.deliveryTime).toLocaleTimeString()}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FoodDeliveries;
