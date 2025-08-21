import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DevotionForm from "@/features/devotions/DevotionForm";
import DevotionDisplay from "@/features/devotions/DevotionDisplay";
import YearSelector from "@/features/devotions/YearSelector";
import { clearSelectedDevotion } from "@/redux/devotionsSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "@/redux/store";
import { getCurrentEthiopianYear } from "@/features/devotions/devotionUtils";
const ManageDevotion = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(getCurrentEthiopianYear().toString()); // Default to current year
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);

    if (showForm) {
      dispatch(clearSelectedDevotion());
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col h-auto mt-12 pt-12 w-[100%] mx-auto space-y-6">
        <YearSelector 
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          userRole={user?.role}
        />
        <div className="flex">
          <DevotionDisplay
            showControls={true}
            devotions={undefined}
            selectedYear={selectedYear}
            toggleForm={toggleForm} // pass the toggleForm function as a prop
          />
          {showForm && <DevotionForm />}
          {/* conditionally render the DevotionForm */}
        </div>
      </div>
    </>
  );
};

export default ManageDevotion;
