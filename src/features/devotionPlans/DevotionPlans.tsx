import React, { useState } from "react";
import {
  useGetDevotionPlansQuery,
  useGetMyDevotionPlansQuery,
  useStartDevotionPlanMutation,
} from "@/redux/api-slices/apiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const PlanCard: React.FC<{
  plan: any;
  onStart: (id: string) => void;
  progressPercent?: number;
}> = ({ plan, onStart, progressPercent }) => {
  return (
    <div className="border rounded p-3 bg-white">
      <div className="mb-2">
        {plan.image ? (
          <img
            src={plan.image}
            alt={plan.title}
            className="w-full h-40 object-cover rounded"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded" />
        )}
      </div>
      <div className="font-bold">{plan.title}</div>
      <div className="text-sm opacity-80 line-clamp-3">{plan.description}</div>
      <div className="text-sm mt-1">
        <span className="font-semibold">{plan.numItems || 0}</span> days
      </div>
      {typeof progressPercent === "number" && (
        <div className="mt-2 text-sm">Progress: {progressPercent}%</div>
      )}
      <div className="mt-3 flex gap-2">
        <button
          className="px-3 py-1 rounded bg-accent-6 text-white font-bold"
          onClick={() => onStart(plan._id)}
        >
          Start Plan
        </button>
      </div>
    </div>
  );
};

const DevotionPlans: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [tab, setTab] = useState<"my" | "find" | "completed">("find");

  const { data: findData, isLoading: loadingFind } = useGetDevotionPlansQuery({});
  const { data: myData, isLoading: loadingMy, refetch: refetchMy } = useGetMyDevotionPlansQuery({});
  const { data: completedData, isLoading: loadingCompleted } = useGetMyDevotionPlansQuery({ status: "completed" });
  const [startPlan] = useStartDevotionPlanMutation();

  const onStart = async (id: string) => {
    if (!user) {
      // Ideally show a toast
      return;
    }
    await startPlan(id).unwrap();
    await refetchMy();
  };

  const renderGrid = (items: any[], withProgress = false) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((p) => (
        <PlanCard
          key={p._id || p.plan?._id}
          plan={p.plan || p}
          onStart={onStart}
          progressPercent={withProgress ? p.progress?.percent : undefined}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Devotion Plans</h2>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded font-bold ${tab === "my" ? "bg-accent-6 text-white" : "border border-accent-6 text-accent-6"}`}
            onClick={() => setTab("my")}
          >
            My Plans
          </button>
          <button
            className={`px-3 py-1 rounded font-bold ${tab === "find" ? "bg-accent-6 text-white" : "border border-accent-6 text-accent-6"}`}
            onClick={() => setTab("find")}
          >
            Find Plans
          </button>
          <button
            className={`px-3 py-1 rounded font-bold ${tab === "completed" ? "bg-accent-6 text-white" : "border border-accent-6 text-accent-6"}`}
            onClick={() => setTab("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      {!user && (
        <div className="border rounded p-3">
          <div className="font-bold mb-1">Sign in to track progress</div>
          <div className="text-sm opacity-70">
            Please log in or create an account to save your devotion plan progress.
          </div>
        </div>
      )}

      {tab === "find" &&
        (loadingFind ? <div>Loading...</div> : renderGrid(findData?.items || []))}
      {tab === "my" &&
        (loadingMy ? <div>Loading...</div> : renderGrid(myData || [], true))}
      {tab === "completed" &&
        (loadingCompleted ? (
          <div>Loading...</div>
        ) : (
          renderGrid(completedData || [], true)
        ))}
    </div>
  );
};

export default DevotionPlans;


