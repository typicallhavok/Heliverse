const DeliveryStaff = () => {
    return (
        <div className="col-span-12 lg:col-span-4 bg-card p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Delivery Staff</h2>
            <div className="space-y-4">
                <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="font-medium">John Smith</p>
                    <p className="text-sm text-muted">Floor 3 - Active</p>
                    <p className="text-sm text-muted">5 deliveries pending</p>
                </div>
            </div>
        </div>
    );
};

export default DeliveryStaff; 