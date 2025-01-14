"use client";
import { useState } from 'react';

type PantryStaffForm = {
    name: string;
    email: string;
    password: string;
    contact: string;
    location: string;
    role: string;
};

type AddPantryStaffModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: PantryStaffForm) => void;
};

const AddPantryStaffModal = ({ show, onClose, onSubmit }: AddPantryStaffModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact: '',
        location: '',
        role: 'Kitchen Staff',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ 
            name: '', 
            email: '', 
            password: '',
            contact: '', 
            location: '', 
            role: 'Kitchen Staff' 
        });
        setShowPassword(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Add Pantry Staff Member</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 rounded border bg-background"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 rounded border bg-background"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full p-2 rounded border bg-background pr-10"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <span className="text-sm">Hide</span>
                                ) : (
                                    <span className="text-sm">Show</span>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Password must be at least 6 characters long
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Contact</label>
                        <input
                            type="tel"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            className="w-full p-2 rounded border bg-background"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-2 rounded border bg-background"
                            required
                            placeholder="Kitchen Area, Storage, etc."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full p-2 rounded border bg-background"
                            required
                        >
                            <option value="Kitchen Staff">Kitchen Staff</option>
                            <option value="Head Chef">Head Chef</option>
                            <option value="Sous Chef">Sous Chef</option>
                            <option value="Prep Cook">Prep Cook</option>
                            <option value="Storage Manager">Storage Manager</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded hover:bg-muted"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
                        >
                            Add Staff Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPantryStaffModal; 