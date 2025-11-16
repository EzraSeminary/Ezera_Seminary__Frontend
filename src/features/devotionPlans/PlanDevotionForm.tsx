import React, { useState } from "react";
import { ethiopianMonths } from "@/features/devotions/devotionUtils";
import { useCreatePlanDevotionMutation, useUpdatePlanDevotionMutation } from "@/redux/api-slices/apiSlice";

interface Props {
  planId: string;
  onCreated?: () => void;
  editing?: { devotionId: string; data: any } | null;
  onDoneEditing?: () => void;
}

const PlanDevotionForm: React.FC<Props> = ({ planId, onCreated, editing, onDoneEditing }) => {
  const [createDev, { isLoading }] = useCreatePlanDevotionMutation();
  const [updateDev, { isLoading: isUpdating }] = useUpdatePlanDevotionMutation();
  const [title, setTitle] = useState<string>("");
  const [chapter, setChapter] = useState<string>("");
  const [verse, setVerse] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [prayer, setPrayer] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  // preload when editing
  React.useEffect(() => {
    if (editing?.data) {
      const d = editing.data;
      if (d.title) setTitle(d.title);
      if (d.chapter) setChapter(d.chapter);
      if (d.verse) setVerse(d.verse);
      if (Array.isArray(d.body) && d.body[0]) setBody(d.body[0]);
      if (d.prayer) setPrayer(d.prayer);
    }
  }, [editing]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", title);
    form.append("chapter", chapter);
    form.append("verse", verse);
    form.append("paragraph0", body);
    form.append("prayer", prayer);
    if (image) form.append("image", image);
    if (editing?.devotionId) {
      await updateDev({ id: planId, devotionId: editing.devotionId, data: form }).unwrap();
    } else {
      await createDev({ id: planId, data: form }).unwrap();
    }
    setTitle("");
    setChapter("");
    setVerse("");
    setBody("");
    setPrayer("");
    setImage(null);
    if (editing?.devotionId) {
      onDoneEditing?.();
    } else {
      onCreated?.();
    }
  };

  return (
    <form onSubmit={submit} className="w-full space-y-3">
      <div className="space-y-1 text-sm text-accent-6">
        <label>Title</label>
        <input
          className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg text-accent-6 px-3 py-2 font-nokia-bold focus:ring-2 focus:ring-accent-6 focus:border-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={35}
        />
      </div>
      <div className="space-y-1 text-sm text-accent-6">
        <label>Chapter to be read</label>
        <input
          className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-accent-6 font-nokia-bold focus:ring-2 focus:ring-accent-6 focus:border-transparent"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          required
          maxLength={35}
        />
      </div>
      <div className="space-y-1 text-sm text-accent-6">
        <label>Main Verse</label>
        <textarea
          className="w-full h-20 border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-accent-6 font-nokia-bold resize-y focus:ring-2 focus:ring-accent-6 focus:border-transparent"
          value={verse}
          onChange={(e) => setVerse(e.target.value)}
          required
          maxLength={300}
        />
      </div>
      <div className="space-y-1 text-sm text-accent-6">
        <label>Body</label>
        <textarea
          className="w-full h-32 border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-accent-6 font-nokia-bold resize-y focus:ring-2 focus:ring-accent-6 focus:border-transparent"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1 text-sm text-accent-6">
        <label>Prayer</label>
        <textarea
          className="w-full h-24 border-2 text-accent-6 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 font-nokia-bold resize-y focus:ring-2 focus:ring-accent-6 focus:border-transparent"
          value={prayer}
          onChange={(e) => setPrayer(e.target.value)}
          required
          maxLength={480}
        />
      </div>
      <div className="space-y-1 text-sm text-accent-6">
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImage(e.target.files[0]);
            }
          }}
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading || isUpdating}
          className="bg-accent-6 hover:bg-accent-7 text-white px-6 py-2 rounded-full font-bold"
        >
          {isLoading || isUpdating ? "Saving..." : editing?.devotionId ? "Update Devotion" : "Save Devotion"}
        </button>
      </div>
    </form>
  );
};

export default PlanDevotionForm;


