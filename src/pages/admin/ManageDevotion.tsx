import DevotionForm from "../features/DevotionComponents/DevotionForm";
import DevotionDisplay from "../features/DevotionComponents/DevotionDisplay";

const ManageDevotion = () => {
  return (
    <div className=" flex h-auto mt-12 w-[100%] mx-auto">
      <DevotionDisplay showControls={true} />
      <DevotionForm />
    </div>
  );
};

export default ManageDevotion;
