import React, { useState } from "react";
import { useCreateDevotionPlanMutation } from "@/redux/api-slices/apiSlice";
import { useNavigate } from "react-router-dom";

interface Props {
  onCreated?: () => void;
}

const DevotionPlanForm: React.FC<Props> = ({ onCreated }) => {
  const [createPlan, { isLoading }] = useCreateDevotionPlanMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    if (imageFile) form.append("image", imageFile);
    try {
      const created = await createPlan(form).unwrap();
      setTitle("");
      setDescription("");
      setImageFile(null);
      onCreated?.();
      if (created?._id) {
        navigate(`/admin/devotion/plans/${created._id}`);
      }
    } catch (err) {
      // Error toast handled globally
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4 border rounded-2xl p-6 bg-primary-5 font-nokia-bold">
      <div className="border-b border-accent-6 pb-2 mb-2">
        <h3 className="text-xl font-bold text-secondary-8">Create Devotion Plan</h3>
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
        <label className="block font-semibold mb-1 text-secondary-8">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-secondary-8 font-nokia-bold"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 rounded-full bg-accent-6 hover:bg-accent-7 text-white font-bold"
        >
          {isLoading ? "Creating..." : "Create Plan"}
        </button>
      </div>
    </form>
  );
};

export default DevotionPlanForm;


