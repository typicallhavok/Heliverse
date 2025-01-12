const DeliveryUpdates = () => {
    return (
        <div className="col-span-12 bg-card p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Delivery Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-secondary/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Room 302</p>
                        <span className="text-sm text-green-500">Delivered</span>
                    </div>
                    <p className="text-sm text-muted">Lunch - Regular Diet</p>
                    <p className="text-sm text-muted">Delivered at 12:15 PM</p>
                </div>
            </div>
        </div>
    );
};

export default DeliveryUpdates; 