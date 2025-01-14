"use client";
import Link from "next/link";

export default function Home() {
	return (
		<div className="landing-container flex justify-center items-center px-24 min-h-screen from-background to-white">
			<div className="w-1/2 px-28 mr-6">
				<div className="heading">
					<div>
						<p className="text-6xl font-extrabold text-primary">HOSPITAL</p>
					</div>
					<div>
						<p className="text-8xl font-black bg-gradient-to-r from-primary to-muted bg-clip-text text-transparent">FOOD</p>
					</div>
					<div>
						<p className="text-6xl font-bold text-muted">MANAGEMENT</p>
					</div>
					<p className="text-muted mt-8 text-base font-medium leading-relaxed">
						Transform your hospital&apos;s food service into a seamless experience. 
						Our intelligent system ensures every patient receives the perfect meal, 
						right on time.
					</p>
				</div>
				<div className="button-group flex gap-4 mt-8">
					<Link href="/register">
						<button className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-muted transition">
							Get Started
						</button>
					</Link>
					<Link href="/login">
						<button className="px-8 py-3 outline outline-1 outline-primary text-primary font-bold rounded-lg hover:bg-secondary hover:outline-none transition">
							Login
						</button>
					</Link>
				</div>
			</div>
			<div className="w-1/2 flex justify-center items-left pr-40">
				<div className="grid grid-cols-2 gap-10">
					<div className="p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition duration-300">
						<h3 className="text-xl font-semibold text-primary mb-2">Patient Management</h3>
						<p className="text-muted">Comprehensive patient details and dietary requirements tracking</p>
					</div>
					<div className="p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition duration-300">
						<h3 className="text-xl font-semibold text-primary mb-2">Diet Planning</h3>
						<p className="text-muted">Create and manage customized meal plans for each patient</p>
					</div>
					<div className="p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition duration-300">
						<h3 className="text-xl font-semibold text-primary mb-2">Kitchen Management</h3>
						<p className="text-muted">Coordinate with kitchen staff and track meal preparation</p>
					</div>
					<div className="p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition duration-300">
						<h3 className="text-xl font-semibold text-primary mb-2">Delivery Tracking</h3>
						<p className="text-muted">Real-time monitoring of meal deliveries and staff assignments</p>
					</div>
				</div>
			</div>
		</div>
	);
}
