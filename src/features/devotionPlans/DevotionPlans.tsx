import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetDevotionPlansQuery,
  useGetMyDevotionPlansQuery,
  useStartDevotionPlanMutation,
  useRestartDevotionPlanMutation,
} from "@/redux/api-slices/apiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BookBookmark, Play, CheckCircle, Clock, ArrowClockwise } from "@phosphor-icons/react";
import LoadingSpinner from "@/components/LoadingSpinner";

const PlanCard: React.FC<{
  plan: any;
  onStart: (id: string) => void;
  progressPercent?: number;
  isStarted?: boolean;
  navigate: (path: string) => void;
}> = ({ plan, onStart, progressPercent, isStarted, navigate }) => {
  const hasProgress = typeof progressPercent === "number";
  const isCompleted = hasProgress && progressPercent === 100;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-accent-6 font-nokia-bold">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-accent-6 to-accent-7">
        {plan.image ? (
          <img
            src={plan.image}
            alt={plan.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookBookmark size={64} weight="fill" className="text-white opacity-50" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Status Badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle size={14} weight="fill" />
            Completed
          </div>
        )}
        {hasProgress && !isCompleted && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock size={14} weight="fill" />
            In Progress
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="font-bold text-xl text-secondary-8 mb-2 line-clamp-2 min-h-[3rem]">
          {plan.title}
        </h3>
        <p className="text-sm text-secondary-6 line-clamp-3 mb-4 min-h-[3.75rem]">
          {plan.description || "A meaningful journey through daily devotions."}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-accent-6">
            <BookBookmark size={20} weight="fill" />
            <span className="font-bold text-sm">
              {plan.numItems || 0} {plan.numItems === 1 ? "Day" : "Days"}
            </span>
          </div>
          {hasProgress && (
            <div className="text-sm font-semibold text-secondary-6">
              {progressPercent}% Complete
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {hasProgress && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-accent-6 to-accent-7 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={async () => {
            if (isStarted && !isCompleted) {
              // Navigate to continue plan
              navigate(`/devotion/plan/${plan._id}`);
            } else if (isCompleted) {
              // Restart completed plan
              try {
                await restartPlan(plan._id).unwrap();
                await refetchMy();
                await refetchCompleted();
                toast.success("Plan restarted! It's now in your active plans.", {
                  position: "top-center",
                });
                // Navigate to the plan
                navigate(`/devotion/plan/${plan._id}`);
              } catch (error) {
                console.error("Error restarting plan:", error);
                toast.error("Failed to restart plan. Please try again.");
              }
            } else {
              onStart(plan._id);
            }
          }}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            isCompleted
              ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              : "bg-gradient-to-r from-accent-6 to-accent-7 text-white hover:from-accent-7 hover:to-accent-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          {isStarted ? (
            <>
              {isCompleted ? (
                <>
                  <ArrowClockwise size={20} weight="fill" />
                  Restart Plan
                </>
              ) : (
                <>
                  <Clock size={20} weight="fill" />
                  Continue Plan
                </>
              )}
            </>
          ) : (
            <>
              <Play size={20} weight="fill" />
              Start Plan
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const DevotionPlans: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [tab, setTab] = useState<"my" | "find" | "completed">("find");

  const { data: findData, isLoading: loadingFind } = useGetDevotionPlansQuery();
  const { data: myData, isLoading: loadingMy, refetch: refetchMy } = useGetMyDevotionPlansQuery({ status: "in_progress" });
  const { data: completedData, isLoading: loadingCompleted, refetch: refetchCompleted } = useGetMyDevotionPlansQuery({ status: "completed" });
  const [startPlan] = useStartDevotionPlanMutation();
  const [restartPlan] = useRestartDevotionPlanMutation();

  // Get list of started plan IDs
  const startedPlanIds = new Set(
    (myData || []).map((p: any) => p.plan?._id || p.planId).filter(Boolean)
  );

  const navigate = useNavigate();
  
  const onStart = async (id: string) => {
    if (!user) {
      alert("Please log in to start a devotion plan");
      return;
    }
    try {
      await startPlan(id).unwrap();
      await refetchMy();
      // Navigate to the plan devotion viewer
      navigate(`/devotion/plan/${id}`);
    } catch (error: any) {
      console.error("Error starting plan:", error);
      if (error?.data?.message === "Plan already started") {
        await refetchMy();
        // Navigate even if already started
        navigate(`/devotion/plan/${id}`);
      } else {
        alert("Failed to start plan. Please try again.");
      }
    }
  };

  const renderGrid = (items: any[], withProgress = false) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-16">
          <BookBookmark size={64} weight="light" className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg text-secondary-6 font-bold">
            {tab === "find" && "No devotion plans available"}
            {tab === "my" && "No active plans started"}
            {tab === "completed" && "No completed plans yet"}
          </p>
          <p className="text-sm text-secondary-4 mt-2">
            {tab === "find" && "Check back later for new plans"}
            {tab === "my" && "Browse available plans and start your journey"}
            {tab === "completed" && "Complete a plan to see it here"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => {
          const plan = p.plan || p;
          const planId = plan._id;
          const isStarted = startedPlanIds.has(planId);
          
          return (
            <PlanCard
              key={planId}
              plan={plan}
              onStart={onStart}
              progressPercent={withProgress ? p.progress?.percent : undefined}
              isStarted={isStarted}
              navigate={navigate}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-8">
          Devotion <span className="text-accent-6">Plans</span>
        </h1>
        <p className="text-lg text-secondary-6 max-w-2xl mx-auto">
          Embark on a structured journey of spiritual growth with our curated devotion plans
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-3 bg-white rounded-2xl p-2 shadow-md">
        <button
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
            tab === "find"
              ? "bg-gradient-to-r from-accent-6 to-accent-7 text-white shadow-lg"
              : "text-secondary-6 hover:bg-gray-100"
          }`}
          onClick={() => setTab("find")}
        >
          <BookBookmark size={20} weight={tab === "find" ? "fill" : "regular"} />
          Find Plans
        </button>
        <button
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
            tab === "my"
              ? "bg-gradient-to-r from-accent-6 to-accent-7 text-white shadow-lg"
              : "text-secondary-6 hover:bg-gray-100"
          }`}
          onClick={() => setTab("my")}
        >
          <Clock size={20} weight={tab === "my" ? "fill" : "regular"} />
          My Plans
        </button>
        <button
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
            tab === "completed"
              ? "bg-gradient-to-r from-accent-6 to-accent-7 text-white shadow-lg"
              : "text-secondary-6 hover:bg-gray-100"
          }`}
          onClick={() => setTab("completed")}
        >
          <CheckCircle size={20} weight={tab === "completed" ? "fill" : "regular"} />
          Completed
        </button>
      </div>

      {/* Login Prompt */}
      {!user && (
        <div className="bg-gradient-to-r from-accent-6/10 to-accent-7/10 border-2 border-accent-6 rounded-2xl p-6 text-center">
          <div className="font-bold text-xl text-secondary-8 mb-2">
            Sign in to track your progress
          </div>
          <div className="text-sm text-secondary-6">
            Please log in or create an account to save your devotion plan progress and continue where you left off.
          </div>
        </div>
      )}

      {/* Loading State */}
      {(loadingFind || loadingMy || loadingCompleted) && (
        <div className="flex flex-col justify-center items-center py-20 min-h-[400px]">
          <LoadingSpinner text="Loading devotion plans..." size="md" />
        </div>
      )}

      {/* Content Grid */}
      {!loadingFind && !loadingMy && !loadingCompleted && (
        <>
          {tab === "find" && renderGrid(findData?.items || [])}
          {tab === "my" && renderGrid(myData || [], true)}
          {tab === "completed" && renderGrid(completedData || [], true)}
        </>
      )}
    </div>
  );
};

export default DevotionPlans;


