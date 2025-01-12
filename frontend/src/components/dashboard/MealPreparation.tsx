const MealPreparation = () => {
    return (
        <div className="col-span-12 lg:col-span-8 bg-card p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Meal Preparation</h2>
            <div className="space-y-4">
                <div className="bg-secondary/20 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-medium">Lunch Batch #1</p>
                        <p className="text-sm text-muted">30 Regular Meals</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-sm">
                        In Progress
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MealPreparation; 