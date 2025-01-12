import MealPreparation from './MealPreparation';
import DeliveryStaff from './DeliveryStaff';
import DeliveryUpdates from './DeliveryUpdates';

const PantryDashboard = () => {
    return (
        <div className="grid grid-cols-12 gap-6">
            <MealPreparation />
            <DeliveryStaff />
            <DeliveryUpdates />
        </div>
    );
};

export default PantryDashboard; 