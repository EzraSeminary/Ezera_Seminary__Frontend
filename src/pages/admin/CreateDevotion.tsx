import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearSelectedDevotion } from "@/redux/devotionsSlice";
import DevotionForm from "@/features/devotions/DevotionForm";
import DevotionPreview from "@/features/devotions/DevotionPreview";

const CreateDevotion = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear the selected devotion when the component mounts
    dispatch(clearSelectedDevotion());
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className=" flex h-auto mx-auto mt-12 w-[98%] gap-4">
      <DevotionPreview />
      <DevotionForm />
    </div>
  );
};

export default CreateDevotion;
