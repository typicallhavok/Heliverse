import { useState } from 'react';

type Patient = {
    name: string;
    room: number;
    bed: number;
    floor: number;
    age: number;
    gender: string;
    diseases: string[];
    allergies: string[];
    contact: string;
    emergencyContact: string;
    dietChart: {
      breakfast: {
        items: string[];
        calories: number;
        restrictions: string;
        nutrients: string;
      };
      lunch: {
        items: string[];
        calories: number;
        restrictions: string;
        nutrients: string;
      };
      dinner: {
        items: string[];
        calories: number;
        restrictions: string;
        nutrients: string;
      };
    };
  };
  
  type Props = {
    show: boolean;
    onClose: () => void;
    onSubmit: (patient: Patient) => void;
  };

const inputClasses = "w-full p-2 rounded-md bg-secondary border border-gray-700 focus:border-primary focus:outline-none transition-colors placeholder:text-muted/50";
const labelClasses = "absolute left-2 -top-2.5 px-1 text-xs transition-all bg-card text-muted";

type NutrientInput = {
    protein: string;
    carbs: string;
    fats: string;
};

const formatNutrients = (nutrients: NutrientInput): string => {
    return `protein: ${nutrients.protein}g, carbs: ${nutrients.carbs}g, fats: ${nutrients.fats}g`;
};

export default function AddPatientModal({ show, onClose, onSubmit }: Props) {
    const [page, setPage] = useState(1);
    const [newPatient, setNewPatient] = useState({
        name: '',
        room: '',
        bed: '',
        floor: '',
        age: '',
        gender: '',
        diseases: '',
        allergies: '',
        contact: '',
        emergencyContact: '',
        dietChart: {
            breakfast: {
                items: '',
                calories: '',
                restrictions: '',
                nutrients: {
                    protein: '',
                    carbs: '',
                    fats: ''
                }
            },
            lunch: {
                items: '',
                calories: '',
                restrictions: '',
                nutrients: {
                    protein: '',
                    carbs: '',
                    fats: ''
                }
            },
            dinner: {
                items: '',
                calories: '',
                restrictions: '',
                nutrients: {
                    protein: '',
                    carbs: '',
                    fats: ''
                }
            }
        }
    });

    const renderNutrientInputs = (meal: 'breakfast' | 'lunch' | 'dinner') => (
        <div className="grid grid-cols-3 gap-4">
            <div className="relative">
                <input
                    type="number"
                    value={newPatient.dietChart[meal].nutrients.protein}
                    onChange={(e) => setNewPatient({
                        ...newPatient,
                        dietChart: {
                            ...newPatient.dietChart,
                            [meal]: {
                                ...newPatient.dietChart[meal],
                                nutrients: {
                                    ...newPatient.dietChart[meal].nutrients,
                                    protein: e.target.value
                                }
                            }
                        }
                    })}
                    className={inputClasses}
                    placeholder="Protein (g)"
                />
                <label className={labelClasses}>Protein (g)</label>
            </div>
            <div className="relative">
                <input
                    type="number"
                    value={newPatient.dietChart[meal].nutrients.carbs}
                    onChange={(e) => setNewPatient({
                        ...newPatient,
                        dietChart: {
                            ...newPatient.dietChart,
                            [meal]: {
                                ...newPatient.dietChart[meal],
                                nutrients: {
                                    ...newPatient.dietChart[meal].nutrients,
                                    carbs: e.target.value
                                }
                            }
                        }
                    })}
                    className={inputClasses}
                    placeholder="Carbs (g)"
                />
                <label className={labelClasses}>Carbs (g)</label>
            </div>
            <div className="relative">
                <input
                    type="number"
                    value={newPatient.dietChart[meal].nutrients.fats}
                    onChange={(e) => setNewPatient({
                        ...newPatient,
                        dietChart: {
                            ...newPatient.dietChart,
                            [meal]: {
                                ...newPatient.dietChart[meal],
                                nutrients: {
                                    ...newPatient.dietChart[meal].nutrients,
                                    fats: e.target.value
                                }
                            }
                        }
                    })}
                    className={inputClasses}
                    placeholder="Fats (g)"
                />
                <label className={labelClasses}>Fats (g)</label>
            </div>
        </div>
    );

    const renderMealSection = (title: string, meal: 'breakfast' | 'lunch' | 'dinner') => (
        <div className="space-y-4">
            <h3 className="font-medium">{title}</h3>
            <div className="relative">
                <input
                    type="text"
                    value={newPatient.dietChart[meal].items}
                    onChange={(e) => setNewPatient({
                        ...newPatient,
                        dietChart: {
                            ...newPatient.dietChart,
                            [meal]: { ...newPatient.dietChart[meal], items: e.target.value }
                        }
                    })}
                    className={inputClasses}
                    placeholder="Items (comma-separated)"
                />
                {newPatient.dietChart[meal].items && <label className={labelClasses}>Items</label>}
            </div>
            <div className="relative">
                <input
                    type="number"
                    value={newPatient.dietChart[meal].calories}
                    onChange={(e) => setNewPatient({
                        ...newPatient,
                        dietChart: {
                            ...newPatient.dietChart,
                            [meal]: { ...newPatient.dietChart[meal], calories: e.target.value }
                        }
                    })}
                    className={inputClasses}
                    placeholder="Calories"
                />
                {newPatient.dietChart[meal].calories && <label className={labelClasses}>Calories</label>}
            </div>
            {renderNutrientInputs(meal)}
            <div className="relative">
                <input
                    type="text"
                    value={newPatient.dietChart[meal].restrictions}
                    onChange={(e) => setNewPatient({
                        ...newPatient,
                        dietChart: {
                            ...newPatient.dietChart,
                            [meal]: { ...newPatient.dietChart[meal], restrictions: e.target.value }
                        }
                    })}
                    className={inputClasses}
                    placeholder="Dietary Restrictions"
                />
                {newPatient.dietChart[meal].restrictions && <label className={labelClasses}>Restrictions</label>}
            </div>
        </div>
    );

    const renderPageContent = () => {
        switch (page) {
            case 1:
                return (
                    <>
                        <h3 className="font-medium mb-4">Patient Details</h3>
                        <div className="relative">
                            <input
                                type="text"
                                value={newPatient.name}
                                onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                                className={inputClasses}
                                placeholder="Patient Name"
                                required
                            />
                            {newPatient.name && <label className={labelClasses}>Name</label>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <select
                                    value={newPatient.gender}
                                    onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                                    className={inputClasses}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                                {newPatient.gender && <label className={labelClasses}>Gender</label>}
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={newPatient.age}
                                    onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                                    className={inputClasses}
                                    placeholder="Age"
                                    required
                                />
                                {newPatient.age && <label className={labelClasses}>Age</label>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={newPatient.room}
                                    onChange={(e) => setNewPatient({...newPatient, room: e.target.value})}
                                    className={inputClasses}
                                    placeholder="Room"
                                    required
                                />
                                {newPatient.room && <label className={labelClasses}>Room</label>}
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={newPatient.bed}
                                    onChange={(e) => setNewPatient({...newPatient, bed: e.target.value})}
                                    className={inputClasses}
                                    placeholder="Bed"
                                    required
                                />
                                {newPatient.bed && <label className={labelClasses}>Bed</label>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={newPatient.floor}
                                    onChange={(e) => setNewPatient({...newPatient, floor: e.target.value})}
                                    className={inputClasses}
                                    placeholder="Floor"
                                    required
                                />
                                {newPatient.floor && <label className={labelClasses}>Floor</label>}
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={newPatient.diseases}
                                onChange={(e) => setNewPatient({...newPatient, diseases: e.target.value})}
                                className={inputClasses}
                                placeholder="Diseases (comma-separated)"
                            />
                            {newPatient.diseases && <label className={labelClasses}>Diseases</label>}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={newPatient.allergies}
                                onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                                className={inputClasses}
                                placeholder="Allergies (comma-separated)"
                            />
                            {newPatient.allergies && <label className={labelClasses}>Allergies</label>}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={newPatient.contact}
                                onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})}
                                className={inputClasses}
                                placeholder="Contact Number"
                                required
                            />
                            {newPatient.contact && <label className={labelClasses}>Contact</label>}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={newPatient.emergencyContact}
                                onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
                                className={inputClasses}
                                placeholder="Emergency Contact Number"
                                required
                            />
                            {newPatient.emergencyContact && <label className={labelClasses}>Emergency Contact</label>}
                        </div>
                    </>
                );
            case 2:
                return renderMealSection('Breakfast Details', 'breakfast');
            case 3:
                return renderMealSection('Lunch Details', 'lunch');
            case 4:
                return renderMealSection('Dinner Details', 'dinner');
            default:
                return null;
        }
    };

    const handleNext = () => {
        if (page < 4) setPage(page + 1);
    };

    const handleBack = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (page !== 4) {
            handleNext();
            return;
        }
        
        try {
            await onSubmit({
                ...newPatient,
                diseases: newPatient.diseases.split(',').map(d => d.trim()).filter(Boolean),
                allergies: newPatient.allergies.split(',').map(a => a.trim()).filter(Boolean),
                room: parseInt(newPatient.room),
                bed: parseInt(newPatient.bed),
                floor: parseInt(newPatient.floor),
                age: parseInt(newPatient.age),
                dietChart: {
                    breakfast: {
                        ...newPatient.dietChart.breakfast,
                        calories: parseInt(newPatient.dietChart.breakfast.calories) || 0,
                        items: newPatient.dietChart.breakfast.items.split(',').map(i => i.trim()).filter(Boolean),
                        nutrients: formatNutrients(newPatient.dietChart.breakfast.nutrients)
                    },
                    lunch: {
                        ...newPatient.dietChart.lunch,
                        calories: parseInt(newPatient.dietChart.lunch.calories) || 0,
                        items: newPatient.dietChart.lunch.items.split(',').map(i => i.trim()).filter(Boolean),
                        nutrients: formatNutrients(newPatient.dietChart.lunch.nutrients)
                    },
                    dinner: {
                        ...newPatient.dietChart.dinner,
                        calories: parseInt(newPatient.dietChart.dinner.calories) || 0,
                        items: newPatient.dietChart.dinner.items.split(',').map(i => i.trim()).filter(Boolean),
                        nutrients: formatNutrients(newPatient.dietChart.dinner.nutrients)
                    }
                }
            });

            // Only clear fields after successful submission
            setNewPatient({
                name: '',
                room: '',
                bed: '',
                floor: '',
                age: '',
                gender: '',
                diseases: '',
                allergies: '',
                contact: '',
                emergencyContact: '',
                dietChart: {
                    breakfast: {
                        items: '',
                        calories: '',
                        restrictions: '',
                        nutrients: {
                            protein: '',
                            carbs: '',
                            fats: ''
                        }
                    },
                    lunch: {
                        items: '',
                        calories: '',
                        restrictions: '',
                        nutrients: {
                            protein: '',
                            carbs: '',
                            fats: ''
                        }
                    },
                    dinner: {
                        items: '',
                        calories: '',
                        restrictions: '',
                        nutrients: {
                            protein: '',
                            carbs: '',
                            fats: ''
                        }
                    }
                }
            });
            setPage(1);
        } catch (error) {
            console.error('Failed to add patient:', error);
            // Optionally show error message to user
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg w-full max-w-md relative">
                <h2 className="text-lg font-semibold mb-4">Add New Patient - Step {page} of 4</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderPageContent()}
                    
                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={page === 1 ? onClose : handleBack}
                            className="px-4 py-2 rounded-lg hover:bg-secondary/20 transition-colors"
                        >
                            {page === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <button
                            type="submit"
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            {page === 4 ? 'Add Patient' : 'Next'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 