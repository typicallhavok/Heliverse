"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Patient = {
	id: string;
	name: string;
	room: number;
	bed: number;
	diseases: string[];
	allergies: string[];
	dietCharts: {
		breakfast: any;
		lunch: any;
		dinner: any;
	}[];
};

const PatientDetails = () => {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const { data } = await axios.get(`${process.env.BACKEND_URL}/patients`, {
					withCredentials: true,
				});
				setPatients(data);
			} catch (error) {
				console.error("Failed to fetch patients:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPatients();
	}, []);

	useEffect(() => {
		if (patients.length > 0) {
			const interval = setInterval(() => {
				setCurrentIndex((prevIndex) => (prevIndex + 1) % patients.length);
			}, 5000);

			return () => clearInterval(interval);
		}
	}, [patients]);

	const handlePrev = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + patients.length) % patients.length
		);
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % patients.length);
	};

	const renderDietInfo = (dietChart: any) => {
		if (!dietChart) return null;

		return (
			<div className="space-y-1">
				<p className="text-sm text-muted">
					Breakfast: {dietChart.breakfast.items.join(", ")}
					{dietChart.breakfast.calories && ` (${dietChart.breakfast.calories} cal)`}
				</p>
				<p className="text-sm text-muted">
					Lunch: {dietChart.lunch.items.join(", ")}
					{dietChart.lunch.calories && ` (${dietChart.lunch.calories} cal)`}
				</p>
				<p className="text-sm text-muted">
					Dinner: {dietChart.dinner.items.join(", ")}
					{dietChart.dinner.calories && ` (${dietChart.dinner.calories} cal)`}
				</p>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="col-span-12 lg:col-span-4 bg-card p-6 rounded-xl animate-pulse">
				<div className="h-6 w-32 bg-secondary/20 rounded mb-4" />
				<div className="space-y-4">
					<div className="h-24 bg-secondary/20 rounded-lg" />
				</div>
			</div>
		);
	}

	if (patients.length === 0) {
		return (
			<div className="col-span-12 lg:col-span-4 bg-card p-6 rounded-xl">
				<p className="text-muted">No patients available.</p>
			</div>
		);
	}

	const currentPatient = patients[currentIndex];

	return (
		<div className="col-span-12 lg:col-span-4 bg-card p-6 rounded-xl">
			<h2 className="text-lg font-semibold mb-4">Patient Details</h2>
			<div className="space-y-4">
				<div className="bg-secondary/20 p-4 rounded-lg">
					<p className="font-medium">{currentPatient.name}</p>
					<p className="text-sm text-muted">
						Room {currentPatient.room} - Bed {currentPatient.bed}
					</p>
					{currentPatient.diseases.length > 0 && (
						<p className="text-sm text-muted">
							Conditions: {currentPatient.diseases.join(", ")}
						</p>
					)}
					{currentPatient.allergies.length > 0 && (
						<p className="text-sm text-muted">
							Allergies: {currentPatient.allergies.join(", ")}
						</p>
					)}
					{currentPatient.dietCharts?.length > 0 && (
						<div className="mt-2">
							<p className="text-sm font-medium">Diet Chart:</p>
							{renderDietInfo(currentPatient.dietCharts[0])}
						</div>
					)}
				</div>
				<div className="flex justify-between mt-4">
					<button onClick={handlePrev} className="text-primary hover:underline">
							Previous
					</button>
					<button onClick={handleNext} className="text-primary hover:underline">
							Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default PatientDetails;
