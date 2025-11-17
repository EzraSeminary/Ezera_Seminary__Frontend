import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DevotionPlanForm from "@/features/devotionPlans/DevotionPlanForm";
import { useGetDevotionPlansQuery, useDeleteDevotionPlanMutation } from "@/redux/api-slices/apiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash, PencilSimple, Plus } from "@phosphor-icons/react";

const ManageDevotionPlans = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: plansData, isLoading, refetch } = useGetDevotionPlansQuery();
  const [deletePlan] = useDeleteDevotionPlanMutation();

  const plans = plansData?.items || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this devotion plan?")) return;
    try {
      await deletePlan(id).unwrap();
      toast.success("Plan deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/devotion/plans/${id}`);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col h-auto mt-12 pt-12 w-[100%] mx-auto space-y-6 px-4 font-nokia-bold">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-secondary-8">Manage Devotion Plans</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-6 hover:bg-accent-7 text-white font-bold"
          >
            <Plus size={20} weight="bold" />
            {showCreateForm ? "Hide Form" : "Create New Plan"}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-primary-5 p-6 rounded-2xl border border-accent-6">
            <DevotionPlanForm
              onCreated={() => {
                setShowCreateForm(false);
                refetch();
                toast.success("Plan created successfully!");
              }}
            />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-6 mx-auto"></div>
            <p className="mt-4 text-secondary-6">Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-accent-6 rounded-xl">
            <p className="text-secondary-6 text-lg mb-4">No devotion plans yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 rounded-full bg-accent-6 hover:bg-accent-7 text-white font-bold"
            >
              Create Your First Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan: any) => (
              <div
                key={plan._id}
                className="border-2 border-accent-6 rounded-xl p-4 bg-primary-5 hover:shadow-lg transition-shadow"
              >
                {plan.image && (
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-secondary-8 mb-2">{plan.title}</h3>
                <p className="text-secondary-6 text-sm mb-3 line-clamp-2">{plan.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-accent-6 font-bold">
                    {plan.numItems || 0} devotions
                  </span>
                  <span className="text-xs text-secondary-4">
                    {plan.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent-6 hover:bg-accent-7 text-white font-bold"
                  >
                    <PencilSimple size={18} weight="bold" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-colors"
                  >
                    <Trash size={18} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageDevotionPlans;

