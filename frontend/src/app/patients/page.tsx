"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AddPatientModal from '@/components/AddPatientModal';

type Patient = {
	id: string;
	name: string;
	room: number;
	bed: number;
	diseases: string[];
	allergies: string[];
};

export default function PatientsPage() {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const { data } = await axios.get("http://localhost:3001/api/patients", {
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

	const handleAddPatient = async (patientData: any) => {
		try {
			const { data } = await axios.post('http://localhost:3001/api/patients', 
				patientData,
				{ withCredentials: true }
			);
			setPatients([...patients, data]);
			setShowForm(false);
		} catch (error) {
			console.error('Failed to add patient:', error);
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

	if (patients.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh]">
				<h1 className="text-2xl font-bold text-muted-foreground">
					No Patients Found
				</h1>
				<p className="text-muted mt-2">
					There are currently no patients in the system.
				</p>
				<button
					onClick={() => setShowForm(true)}
					className="bg-primary text-primary-foreground w-12 h-12 rounded-full hover:bg-primary/90 text-2xl font-semibold flex items-center justify-center mt-4"
				>
					+
				</button>
				<AddPatientModal 
					show={showForm}
					onClose={() => setShowForm(false)}
					onSubmit={handleAddPatient}
				/>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-4">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">Patients</h1>
					<button
						onClick={() => setShowForm(true)}
						className="bg-primary text-primary-foreground w-12 h-12 rounded-full hover:bg-primary/90 text-2xl font-semibold flex items-center justify-center"
					>
						+
					</button>
				</div>

				{patients.map((patient) => (
					<div
						key={patient.id}
						onClick={() => router.push(`/patients/${patient.id}`)}
						className="bg-card p-6 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
					>
						<div className="flex justify-between items-start">
							<div>
								<h2 className="text-lg font-semibold">{patient.name}</h2>
								<p className="text-sm text-muted">
									Room {patient.room} - Bed {patient.bed}
								</p>
								{patient.diseases.length > 0 && (
									<p className="text-sm text-muted mt-1">
										Conditions: {patient.diseases.join(", ")}
									</p>
								)}
							</div>
							<div className="text-sm text-muted">
								{patient.allergies.length > 0 && (
									<p>Allergies: {patient.allergies.length}</p>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
			<AddPatientModal 
				show={showForm}
				onClose={() => setShowForm(false)}
				onSubmit={handleAddPatient}
			/>
		</>
	);
}
