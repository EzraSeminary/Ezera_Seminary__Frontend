import { useState } from "react";
import { useDispatch } from "react-redux";
import DevotionForm from "@/features/devotions/DevotionForm";
import DevotionDisplay from "@/features/devotions/DevotionDisplay";
import { clearSelectedDevotion } from "@/redux/devotionsSlice";
const ManageDevotion = () => {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);

    if (showForm) {
      dispatch(clearSelectedDevotion());
    }
  };
  return (
    <div className=" flex h-auto mt-12 pt-12 w-[100%] mx-auto">
      <DevotionDisplay
        showControls={true}
        devotions={undefined}
        selectedDevotion={null}
        setSelectedDevotion={function (): void {
          throw new Error("Function not implemented.");
        }}
        toggleForm={toggleForm} // pass the toggleForm function as a prop
      />
      {showForm && <DevotionForm />}
      {/* conditionally render the DevotionForm */}
    </div>
  );
};

export default ManageDevotion;
