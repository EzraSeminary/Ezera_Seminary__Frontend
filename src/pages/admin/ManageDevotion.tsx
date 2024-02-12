import DevotionForm from "@/features/devotions/DevotionForm";
import DevotionDisplay from "@/features/devotions/DevotionDisplay";

const ManageDevotion = () => {
  return (
    <div className=" flex h-auto mt-12 w-[100%] mx-auto">
      <DevotionDisplay showControls={true} />
      <DevotionForm />
    </div>
  );
};

export default ManageDevotion;
