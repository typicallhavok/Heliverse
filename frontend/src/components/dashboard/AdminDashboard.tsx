import Alerts from "./Alerts";
import DietCharts from "./DietCharts";
import FoodDeliveries from "./FoodDeliveries";
import PantryPerformance from "./PantryPerformance";
import PatientDetails from "./PatientDetails";

const AdminDashboard = () => {
    return (
        <div className="grid grid-cols-12 gap-6">
            <FoodDeliveries />
            <PatientDetails />
            <PantryPerformance />
            <Alerts />
            <DietCharts />
        </div>
    );
};

export default AdminDashboard; 