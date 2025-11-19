import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetDevotionPlanByIdQuery,
  useGetPlanDevotionsQuery,
  useCreatePlanDevotionMutation,
  useDeletePlanDevotionMutation,
  useReorderPlanDevotionMutation,
} from "@/redux/api-slices/apiSlice";
import PlanDevotionForm from "@/features/devotionPlans/PlanDevotionForm";
import DevotionPlanEditForm from "@/features/devotionPlans/DevotionPlanEditForm";
import { CaretUp, CaretDown } from "@phosphor-icons/react";

const ManageDevotionPlan: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: plan, refetch: refetchPlan } = useGetDevotionPlanByIdQuery(id);
  const { data, refetch } = useGetPlanDevotionsQuery({ id });
  const [deletePlanDevotion] = useDeletePlanDevotionMutation();
  const [reorderDevotion] = useReorderPlanDevotionMutation();
  const items = data?.items || [];
  const [editing, setEditing] = useState<{ devotionId: string; data: any } | null>(null);
  const [showEditPlan, setShowEditPlan] = useState(false);
  
  const handleReorder = async (devotionId: string, direction: "up" | "down") => {
    await reorderDevotion({ id, devotionId, direction }).unwrap();
    await refetch();
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
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-xl">{plan?.title || "Devotion Plan"}</h2>
          <button
            className="px-3 py-1 rounded border border-accent-6 text-accent-6 font-bold hover:bg-accent-6 hover:text-white transition-colors"
            onClick={() => setShowEditPlan(!showEditPlan)}
          >
            {showEditPlan ? "Cancel Edit" : "Edit Plan"}
          </button>
        </div>
        <div />
      </div>

      {showEditPlan && plan && (
        <div className="border rounded-2xl p-6 bg-primary-5">
          <DevotionPlanEditForm
            plan={plan}
            onUpdated={() => {
              setShowEditPlan(false);
              refetchPlan();
            }}
          />
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
              {items.map((d: any, index: number) => (
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


