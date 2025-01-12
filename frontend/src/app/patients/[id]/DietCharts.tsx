"use client";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

type DietChart = {
    breakfast: {
        calories: number;
        nutrients: string;
    };
    lunch: {
        calories: number;
        nutrients: string;
    };
    dinner: {
        calories: number;
        nutrients: string;
    };
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

export default function DietCharts({ dietChart }: { dietChart: DietChart }) {
    const caloriesData = {
        labels: ['Breakfast', 'Lunch', 'Dinner'],
        datasets: [
            {
                data: [
                    dietChart.breakfast.calories,
                    dietChart.lunch.calories,
                    dietChart.dinner.calories,
                ],
                backgroundColor: [
                    'rgba(255, 68, 86, 0.5)',
                    'rgba(212, 127, 255, 0.5)',
                    'rgba(136, 136, 136, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 68, 86, 1)',
                    'rgba(212, 127, 255, 1)',
                    'rgba(136, 136, 136, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const nutrientsData = {
        labels: ['Breakfast', 'Lunch', 'Dinner'],
        datasets: [
            {
                label: 'Protein (g)',
                data: [
                    parseNutrients(dietChart.breakfast.nutrients).protein,
                    parseNutrients(dietChart.lunch.nutrients).protein,
                    parseNutrients(dietChart.dinner.nutrients).protein,
                ],
                backgroundColor: 'rgba(255, 68, 86, 0.5)',
                borderColor: 'rgba(255, 68, 86, 1)',
                borderWidth: 1,
            },
            {
                label: 'Carbs (g)',
                data: [
                    parseNutrients(dietChart.breakfast.nutrients).carbs,
                    parseNutrients(dietChart.lunch.nutrients).carbs,
                    parseNutrients(dietChart.dinner.nutrients).carbs,
                ],
                backgroundColor: 'rgba(212, 127, 255, 0.5)',
                borderColor: 'rgba(212, 127, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'Fats (g)',
                data: [
                    parseNutrients(dietChart.breakfast.nutrients).fats,
                    parseNutrients(dietChart.lunch.nutrients).fats,
                    parseNutrients(dietChart.dinner.nutrients).fats,
                ],
                backgroundColor: 'rgba(136, 136, 136, 0.5)',
                borderColor: 'rgba(136, 136, 136, 1)',
                borderWidth: 1,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#e0e0e0'
                }
            },
            title: {
                display: true,
                text: 'Daily Calorie Distribution',
                color: '#e0e0e0',
                font: {
                    size: 16
                }
            }
        },
        cutout: '70%'
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#e0e0e0'
                }
            },
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#888888'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#888888'
                }
            }
        }
    };

    const totalCalories = dietChart.breakfast.calories + dietChart.lunch.calories + dietChart.dinner.calories;

    return (
        <>
            <div className="bg-card p-4 rounded-lg shadow-lg border border-border/50 flex items-center justify-center place-self-center w-full h-full">
                <div className="relative w-full max-w-[250px]">
                    <Doughnut data={caloriesData} options={doughnutOptions} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary pt-20">{totalCalories}</p>
                            <p className="text-sm text-muted">Total Calories</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-2 bg-card p-4 rounded-lg shadow-lg border border-border/50 place-self-center w-full">
                <Bar data={nutrientsData} options={barOptions} />
            </div>
        </>
    );
} 