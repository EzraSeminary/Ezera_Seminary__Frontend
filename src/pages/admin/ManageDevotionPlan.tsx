import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetDevotionPlanByIdQuery,
  useGetPlanDevotionsQuery,
  useDeletePlanDevotionMutation,
  useReorderPlanDevotionMutation,
  useUpdateDevotionPlanMutation,
} from "@/redux/api-slices/apiSlice";
import PlanDevotionForm from "@/features/devotionPlans/PlanDevotionForm";
import { CaretUp, CaretDown, PencilSimple, X } from "@phosphor-icons/react";
import { toast } from "react-toastify";

const ManageDevotionPlan: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: plan, refetch: refetchPlan } = useGetDevotionPlanByIdQuery(id);
  const { data, refetch } = useGetPlanDevotionsQuery({ id });
  const [deletePlanDevotion] = useDeletePlanDevotionMutation();
  const [reorderDevotion] = useReorderPlanDevotionMutation();
  const [updatePlan] = useUpdateDevotionPlanMutation();
  const items = data?.items || [];
  const [editing, setEditing] = useState<{ devotionId: string; data: Record<string, unknown> } | null>(null);
  const [editingPlan, setEditingPlan] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planImageFile, setPlanImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (plan) {
      setPlanTitle(plan.title || "");
      setPlanDescription(plan.description || "");
    }
  }, [plan]);
  
  const handleReorder = async (devotionId: string, direction: "up" | "down") => {
    await reorderDevotion({ id, devotionId, direction }).unwrap();
    await refetch();
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("title", planTitle);
      form.append("description", planDescription);
      if (planImageFile) {
        form.append("image", planImageFile);
      }
      await updatePlan({ id, data: form }).unwrap();
      toast.success("Plan updated successfully!");
      setEditingPlan(false);
      refetchPlan();
    } catch (error: unknown) {
      const err = error as { data?: { error?: string } };
      toast.error(err.data?.error || "Failed to update plan");
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-6 font-nokia-bold">
      <div className="flex items-center justify-between">
        <button
          className="px-3 py-1 rounded border border-accent-6 text-accent-6 font-bold"
          onClick={() => navigate("/admin/devotion-plans/manage")}
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-xl">{plan?.title || "Devotion Plan"}</h2>
          {!editingPlan && (
            <button
              onClick={() => setEditingPlan(true)}
              className="flex items-center gap-2 px-3 py-1 rounded border border-accent-6 text-accent-6 font-bold hover:bg-accent-6 hover:text-white transition-colors"
            >
              <PencilSimple size={18} weight="bold" />
              Edit Plan
            </button>
          )}
        </div>
        <div />
      </div>

      {/* Edit Plan Form */}
      {editingPlan && (
        <div className="border-2 border-accent-6 rounded-2xl p-6 bg-primary-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-secondary-8">Edit Devotion Plan</h3>
            <button
              onClick={() => {
                setEditingPlan(false);
                setPlanImageFile(null);
                if (plan) {
                  setPlanTitle(plan.title || "");
                  setPlanDescription(plan.description || "");
                }
              }}
              className="p-1 rounded hover:bg-gray-200"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
          <form onSubmit={handleUpdatePlan} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1 text-secondary-8">Title</label>
              <input
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-secondary-8 font-nokia-bold focus:ring-2 focus:ring-accent-6 focus:border-transparent"
                placeholder="Plan title"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-secondary-8">Description</label>
              <textarea
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
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
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPlanImageFile(e.target.files[0]);
                  }
                }}
                className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-secondary-8 font-nokia-bold"
              />
              {plan?.image && !planImageFile && (
                <p className="text-xs text-secondary-6 mt-1">Current image will be kept if no new image is selected</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-accent-6 hover:bg-accent-7 text-white font-bold"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingPlan(false);
                  setPlanImageFile(null);
                  if (plan) {
                    setPlanTitle(plan.title || "");
                    setPlanDescription(plan.description || "");
                  }
                }}
                className="px-6 py-2 rounded-full border-2 border-accent-6 text-accent-6 font-bold hover:bg-accent-6 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-2xl p-4 bg-primary-5">
          <h3 className="font-bold text-lg mb-2 text-secondary-8">
            {editing ? "Edit Devotion" : "Add Devotion to Plan"}
          </h3>
          <PlanDevotionForm
            planId={id}
            onCreated={() => refetch()}
            editing={editing}
            onDoneEditing={() => {
              setEditing(null);
              refetch();
            }}
          />
        </div>
        <div className="border rounded-2xl p-4 bg-primary-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-secondary-8">Devotions in Plan</h3>
            <button
              className="px-3 py-1 rounded border border-accent-6 text-accent-6 font-bold"
              onClick={() => refetch()}
            >
              Refresh
            </button>
          </div>
          {items.length === 0 ? (
            <div className="text-sm opacity-70">No devotions yet.</div>
          ) : (
            <div className="space-y-3 max-h-[680px] overflow-auto pr-2">
              {items.map((d: Record<string, unknown> & { _id: string; title?: string; chapter?: string; image?: string }, index: number) => (
                <div key={d._id} className="border rounded p-3 bg-white flex gap-3 items-center">
                  <div className="flex flex-col gap-1">
                    <button
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                      disabled={index === 0}
                      onClick={() => handleReorder(d._id, "up")}
                      title="Move up"
                    >
                      <CaretUp size={16} weight="bold" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                      disabled={index === items.length - 1}
                      onClick={() => handleReorder(d._id, "down")}
                      title="Move down"
                    >
                      <CaretDown size={16} weight="bold" />
                    </button>
                  </div>
                  <div className="text-sm font-bold text-accent-6 w-12 text-center">
                    Day {index + 1}
                  </div>
                  <div className="w-20 h-16 bg-gray-100 rounded overflow-hidden">
                    {d.image ? (
                      <img className="w-full h-full object-cover" src={d.image} alt={d.title} />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{d.title}</div>
                    <div className="text-xs opacity-70">
                      {d.chapter}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded border border-accent-6 text-accent-6 font-bold"
                      onClick={() => setEditing({ devotionId: d._id, data: d })}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white font-bold"
                      onClick={async () => {
                        await deletePlanDevotion({ id, devotionId: d._id }).unwrap();
                        await refetch();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDevotionPlan;


