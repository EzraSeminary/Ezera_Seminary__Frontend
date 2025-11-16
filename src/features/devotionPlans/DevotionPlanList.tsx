import React from "react";
import {
  useDeleteDevotionPlanMutation,
  useGetDevotionPlansQuery,
} from "@/redux/api-slices/apiSlice";

interface Props {
  onRefresh?: () => void;
}

const DevotionPlanList: React.FC<Props> = ({ onRefresh }) => {
  const { data, refetch, isLoading } = useGetDevotionPlansQuery({});
  const [deletePlan] = useDeleteDevotionPlanMutation();
  const items = data?.items || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    await deletePlan(id).unwrap();
    await refetch();
    onRefresh?.();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">Devotion Plans</h3>
        <button
          onClick={() => refetch()}
          className="px-3 py-1 rounded border border-accent-6 text-accent-6 font-bold"
        >
          Refresh
        </button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-sm opacity-70">No plans yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p: any) => (
            <div key={p._id} className="border rounded p-3 bg-white">
              <div className="mb-2">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded" />
                )}
              </div>
              <div className="font-bold">{p.title}</div>
              <div className="text-sm opacity-80 line-clamp-3">{p.description}</div>
              <div className="text-sm mt-1">
                <span className="font-semibold">{p.numItems || 0}</span> days
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 rounded bg-red-600 text-white font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DevotionPlanList;


