import DevotionForm from "../features/DevotionComponents/DevotionForm";
import DevotionPreview from "@/features/DevotionComponents/DevotionPreview";

const CreateDevotion = () => {
  return (
    <div className=" flex h-auto mx-auto mt-12 w-[98%] gap-4">
      <DevotionPreview />
      <DevotionForm />
    </div>
  );
};

export default CreateDevotion;
