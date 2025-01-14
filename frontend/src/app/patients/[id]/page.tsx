"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import DietCharts from './DietCharts';

type Patient = {
	id: string;
	name: string;
	room: number;
	bed: number;
	gender: string;
	age: number;
	diseases: string[];
	allergies: string[];
	DietCharts: {
		breakfast: {
			items: string[];
			calories: number;
			nutrients: string;
			restrictions: string;
		};
		lunch: {
			items: string[];
			calories: number;
			nutrients: string;
			restrictions: string;
		};
		dinner: {
			items: string[];
			calories: number;
			nutrients: string;
			restrictions: string;
		};
	}[];
};

const parseNutrients = (nutrientString: string) => {

	const nutrients = {
		protein: 0,
		carbs: 0,
		fats: 0
	};
	
	try {
		if (!nutrientString) return nutrients;

		const parts = nutrientString.split(',').map(part => part.trim());


		parts.forEach(part => {
			const [name, valueWithG] = part.split(':').map(p => p.trim());

			const value = valueWithG.replace(/[^0-9]/g, '');
			const numValue = parseInt(value) || 0;

			if (name.toLowerCase().includes('protein')) nutrients.protein = numValue;
			if (name.toLowerCase().includes('carb')) nutrients.carbs = numValue;
			if (name.toLowerCase().includes('fat')) nutrients.fats = numValue;
		});
	} catch (error) {
		console.error('Error parsing nutrients:', error);
	}
	

	return nutrients;
};

const calculateTotalProtein = (dietChart: any) => {
	const breakfastProtein = parseNutrients(dietChart.breakfast.nutrients).protein;
	const lunchProtein = parseNutrients(dietChart.lunch.nutrients).protein;
	const dinnerProtein = parseNutrients(dietChart.dinner.nutrients).protein;
	
	return breakfastProtein + lunchProtein + dinnerProtein;
};

export default function PatientPage() {
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const router = useRouter();

	useEffect(() => {
		const fetchPatient = async () => {
			try {
				const { data } = await axios.get(
					`${process.env.BACKEND_URL}/patients/${params.id}`,
					{
						withCredentials: true,
					}
				);
				setPatient(data);
			} catch (error) {
				console.error("Failed to fetch patient:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPatient();
	}, [params.id]);

	const handleDelete = async () => {
		if (window.confirm('Are you sure you want to remove this patient?')) {
			try {
				await axios.delete(`${process.env.BACKEND_URL}/patients/${params.id}`, {
					withCredentials: true
				});
				router.push('/patients');
			} catch (error) {
				console.error('Failed to delete patient:', error);
			}
		}
	};

	if (loading) {
		return (
			<div className="animate-pulse space-y-4">
				<div className="h-8 w-48 bg-card rounded" />
				<div className="h-32 bg-card rounded" />
			</div>
		);
	}

	if (!patient) {
		return <div className="text-muted">Patient not found</div>;
	}

	return (
		<div className="space-y-4 max-w-6xl mx-auto px-4 py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-primary">{patient.name}</h1>
				<button
					onClick={handleDelete}
					className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
				>
					Remove Patient
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-card p-4 rounded-lg shadow-lg border border-border/50">
					<h2 className="text-lg font-semibold mb-3 text-foreground text-center">Basic Info</h2>
					<div className="space-y-3">
						<div className="bg-secondary/20 p-3 rounded-lg">
							<p className="text-sm text-muted text-center">Room & Bed</p>
							<p className="text-base font-medium text-center">
									Room {patient.room}, Bed {patient.bed}
							</p>
						</div>
						<div className="bg-secondary/20 p-3 rounded-lg">
							<p className="text-sm text-muted text-center">Gender</p>
							<p className="text-base font-medium text-center">
								{patient.gender}
							</p>
						</div>
						<div className="bg-secondary/20 p-3 rounded-lg">
							<p className="text-sm text-muted text-center">Age</p>
							<p className="text-base font-medium text-center">
								{patient.age} years
							</p>
						</div>
					</div>
				</div>

				<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-card p-4 rounded-lg shadow-lg border border-border/50">
						<h2 className="text-lg font-semibold mb-3 text-foreground">Medical Conditions</h2>
						<div className="bg-secondary/20 p-3 rounded-lg">
							{patient.diseases.length > 0 ? (
								<ul className="space-y-2">
									{patient.diseases.map((disease, index) => (
										<li key={index} className="flex items-center gap-2">
											<span className="h-2 w-2 rounded-full bg-red-500"></span>
											<span>{disease}</span>
										</li>
									))}
								</ul>
							) : (
								<span className="text-muted">No medical conditions</span>
							)}
						</div>
					</div>

					<div className="bg-card p-4 rounded-lg shadow-lg border border-border/50">
						<h2 className="text-lg font-semibold mb-3 text-foreground">Allergies</h2>
						<div className="bg-secondary/20 p-3 rounded-lg">
							{patient.allergies.length > 0 ? (
								<ul className="space-y-2">
									{patient.allergies.map((allergy, index) => (
										<li key={index} className="flex items-center gap-2">
											<span className="h-2 w-2 rounded-full bg-yellow-500"></span>
											<span>{allergy}</span>
										</li>
									))}
								</ul>
							) : (
								<span className="text-muted">No allergies</span>
							)}
						</div>
					</div>
				</div>

				<div className="bg-card p-4 rounded-lg shadow-lg border border-border/50">
					<h2 className="text-lg font-semibold mb-3 text-foreground text-center">Quick Stats</h2>
					<div className="space-y-3">
						<div className="bg-secondary/20 p-3 rounded-lg">
							<p className="text-sm text-muted text-center">Total Daily Calories</p>
							<p className="text-xl font-bold text-primary text-center">
								{patient.DietCharts?.[0] ? 
									patient.DietCharts[0].breakfast.calories + 
									patient.DietCharts[0].lunch.calories + 
									patient.DietCharts[0].dinner.calories : 
									0
								} kcal
							</p>
						</div>
						<div className="bg-secondary/20 p-3 rounded-lg">
							<p className="text-sm text-muted text-center">Total Daily Protein</p>
							<p className="text-xl font-bold text-accent text-center">
								{patient.DietCharts?.[0] ? 
									calculateTotalProtein(patient.DietCharts[0]) : 
									0
								}g
							</p>
						</div>
					</div>
				</div>
			</div>

			{patient.DietCharts?.[0] && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<DietCharts dietChart={patient.DietCharts[0]} />
					{['breakfast', 'lunch', 'dinner'].map((meal) => (
						<div key={meal} className="bg-card p-4 rounded-lg shadow-lg border border-border/50">
							<h3 className="text-lg font-semibold mb-3 text-foreground capitalize text-center">{meal}</h3>
							<div className="space-y-3">
								<div className="bg-secondary/20 p-3 rounded-lg">
									<p className="text-sm text-muted mb-2">Items:</p>
									<ul className="space-y-1">
										{patient.DietCharts[0][meal as keyof typeof patient.DietCharts[0]].items.map((item, index) => (
											<li key={index} className="text-sm flex items-center gap-2">
												<span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
												{item}
											</li>
										))}
									</ul>
								</div>
								<div className="bg-secondary/20 p-3 rounded-lg">
									<p className="text-sm text-muted mb-1">Calories:</p>
									<p className="font-medium">
										{patient.DietCharts[0][meal as keyof typeof patient.DietCharts[0]].calories} kcal
									</p>
								</div>
								{patient.DietCharts[0][meal as keyof typeof patient.DietCharts[0]].restrictions && (
									<div className="bg-red-500/10 p-3 rounded-lg">
										<p className="text-sm text-red-500">
											{patient.DietCharts[0][meal as keyof typeof patient.DietCharts[0]].restrictions}
										</p>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
