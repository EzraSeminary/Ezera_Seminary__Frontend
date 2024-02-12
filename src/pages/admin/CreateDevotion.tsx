import DevotionForm from "@/features/devotions/DevotionForm";
import DevotionPreview from "@/features/devotions/DevotionPreview";

const CreateDevotion = () => {
  return (
    <div className=" flex h-auto mx-auto mt-12 w-[98%] gap-4">
      <DevotionPreview />
      <DevotionForm />
    </div>
  );
};

export default CreateDevotion;
