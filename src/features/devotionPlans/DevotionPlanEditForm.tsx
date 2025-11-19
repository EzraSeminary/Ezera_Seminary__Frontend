import React, { useState, useEffect } from "react";
import { useUpdateDevotionPlanMutation } from "@/redux/api-slices/apiSlice";

interface Props {
  plan: any;
  onUpdated?: () => void;
}

const DevotionPlanEditForm: React.FC<Props> = ({ plan, onUpdated }) => {
  const [updatePlan, { isLoading }] = useUpdateDevotionPlanMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    if (plan) {
      setTitle(plan.title || "");
      setDescription(plan.description || "");
      setPublished(plan.published !== undefined ? plan.published : true);
      setImagePreview(plan.image || null);
    }
  }, [plan]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("published", published.toString());
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await updatePlan({ id: plan._id, formData }).unwrap();
      setImageFile(null);
      onUpdated?.();
    } catch (err) {
      console.error("Error updating plan:", err);
    }
  };

  if (!plan) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 font-nokia-bold">
      <div className="border-b border-accent-6 pb-2 mb-2">
        <h3 className="text-xl font-bold text-secondary-8">Edit Devotion Plan</h3>
      </div>
      
      <div>
        <label className="block font-semibold mb-1 text-secondary-8">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-secondary-8 font-nokia-bold focus:ring-2 focus:ring-accent-6 focus:border-transparent"
          placeholder="Plan title"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1 text-secondary-8">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-secondary-8 font-nokia-bold focus:ring-2 focus:ring-accent-6 focus:border-transparent"
          placeholder="Brief description"
          rows={4}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1 text-secondary-8">Published</label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 text-accent-6 rounded focus:ring-accent-6"
          />
          <span className="text-secondary-8">Make this plan visible to users</span>
        </label>
      </div>

      <div>
        <label className="block font-semibold mb-1 text-secondary-8">Image</label>
        {imagePreview && (
          <div className="mb-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-secondary-8 font-nokia-bold"
        />
        <p className="text-xs text-secondary-6 mt-1">
          Leave empty to keep current image
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 rounded-full bg-accent-6 hover:bg-accent-7 text-white font-bold disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Plan"}
        </button>
      </div>
    </form>
  );
};

export default DevotionPlanEditForm;

