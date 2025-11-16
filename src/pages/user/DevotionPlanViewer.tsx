import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useGetDevotionPlanByIdQuery,
  useGetPlanDevotionsQuery,
  useStartDevotionPlanMutation,
  useRecordDevotionPlanProgressMutation,
  useGetMyDevotionPlansQuery,
} from "@/redux/api-slices/apiSlice";
import { ArrowLeft, ArrowRight, CheckCircle, BookBookmark } from "@phosphor-icons/react";
import Footer from "@/components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DevotionPlanViewer = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const { data: plan } = useGetDevotionPlanByIdQuery(id);
  const { data: devotionsData } = useGetPlanDevotionsQuery({ id });
  const { data: myPlans } = useGetMyDevotionPlansQuery();
  const [startPlan] = useStartDevotionPlanMutation();
  const [recordProgress] = useRecordDevotionPlanProgressMutation();
  
  const devotions = devotionsData?.items || [];
  const myPlan = myPlans?.find((p: any) => String(p.planId) === String(id));
  const completedIds = myPlan?.itemsCompleted || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (myPlan) {
      setHasStarted(true);
      // Find first incomplete devotion or stay at 0
      const firstIncomplete = devotions.findIndex((d: any) => !completedIds.includes(d._id));
      if (firstIncomplete >= 0) {
        setCurrentIndex(firstIncomplete);
      }
    }
  }, [myPlan, devotions, completedIds]);

  const handleStart = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to start a devotion plan");
      navigate("/login");
      return;
    }

    try {
      console.log("[DevotionPlanViewer] Starting plan:", id);
      console.log("[DevotionPlanViewer] User token exists:", !!user?.token);
      const result = await startPlan(id).unwrap();
      console.log("[DevotionPlanViewer] Plan started:", result);
      setHasStarted(true);
      // Mark first as viewed
      if (devotions[0]) {
        console.log("[DevotionPlanViewer] Recording progress for first devotion:", devotions[0]._id);
        await recordProgress({ id, devotionId: devotions[0]._id }).unwrap();
      }
    } catch (error: any) {
      console.error("[DevotionPlanViewer] Error starting plan:", error);
      console.error("[DevotionPlanViewer] Error details:", error.data || error.message);
      
      // If 403, likely auth issue
      if (error.status === 403) {
        toast.error("Please log in to start a devotion plan");
        navigate("/login");
      } else {
        toast.error(error.data?.error || error.message || 'Failed to start plan. Please try again.');
      }
    }
  };

  const handleNext = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < devotions.length) {
      setCurrentIndex(nextIndex);
      // Record progress
      try {
        await recordProgress({ id, devotionId: devotions[nextIndex]._id }).unwrap();
      } catch (error) {
        console.error("Error recording progress:", error);
      }
    } else {
      // Completed
      setShowCompletion(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!user) {
    return (
      <div className="absolute top-0 w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Please log in to view devotion plans</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-accent-6 text-white rounded-full font-bold"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (!plan || devotions.length === 0) {
    return (
      <div className="absolute top-0 w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="absolute top-0 w-full font-nokia-bold">
        <div className="devotion-img bg-cover w-full py-14 md:py-20 lg:py-28 flex justify-center items-center">
          <div className="z-10 text-primary-1 align-middle font-bold text-center">
            <BookBookmark size={64} className="mx-auto mb-4 text-accent-6" weight="fill" />
            <div className="text-2xl md:text-5xl mb-4">{plan.title}</div>
            <p className="text-lg md:text-xl text-primary-3 max-w-2xl mx-auto mb-6">
              {plan.description}
            </p>
            <div className="text-accent-6 text-xl mb-8">
              {devotions.length} Days
            </div>
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-accent-6 hover:bg-accent-7 text-white text-lg rounded-full font-bold"
            >
              Start Plan
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div className="absolute top-0 w-full font-nokia-bold">
        <div className="devotion-img bg-cover w-full py-14 md:py-20 lg:py-28 flex justify-center items-center">
          <div className="z-10 text-primary-1 align-middle font-bold text-center">
            <CheckCircle size={80} className="mx-auto mb-4 text-green-500" weight="fill" />
            <div className="text-2xl md:text-5xl mb-4">Congratulations!</div>
            <p className="text-lg md:text-xl text-primary-3 max-w-2xl mx-auto mb-6">
              You've completed the {plan.title} devotion plan
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentIndex(0)}
                className="px-6 py-2 border-2 border-accent-6 text-accent-6 rounded-full font-bold hover:bg-accent-6 hover:text-white"
              >
                Review
              </button>
              <button
                onClick={() => navigate("/devotion")}
                className="px-6 py-2 bg-accent-6 hover:bg-accent-7 text-white rounded-full font-bold"
              >
                Back to Devotions
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentDevotion = devotions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / devotions.length) * 100);

  return (
    <div className="absolute top-0 w-full font-nokia-bold">
      <ToastContainer />
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div
          className="bg-accent-6 h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="w-11/12 mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/devotion")}
            className="flex items-center gap-2 text-accent-6 font-bold hover:text-accent-7"
          >
            <ArrowLeft size={20} weight="bold" />
            Back
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-secondary-8">{plan.title}</h2>
            <p className="text-sm text-secondary-6">
              Day {currentIndex + 1} of {devotions.length}
            </p>
          </div>
          <div className="w-20" />
        </div>

        {/* Devotion Content */}
        <div className="max-w-4xl mx-auto">
          {currentDevotion.image && (
            <img
              src={currentDevotion.image}
              alt={currentDevotion.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-secondary-8 mb-4">
            {currentDevotion.title}
          </h1>

          <div className="mb-4">
            <span className="text-sm text-secondary-6">Scripture Reading:</span>
            <p className="text-lg text-accent-6 font-bold">{currentDevotion.chapter}</p>
          </div>

          {currentDevotion.verse && (
            <div className="border-2 border-accent-6 rounded-xl p-6 bg-primary-5 mb-6">
              <p className="text-lg text-secondary-8 italic">{currentDevotion.verse}</p>
            </div>
          )}

          {currentDevotion.body && currentDevotion.body[0] && (
            <div
              className="prose prose-lg max-w-none mb-6 text-secondary-8"
              dangerouslySetInnerHTML={{ __html: currentDevotion.body[0] }}
            />
          )}

          {currentDevotion.prayer && (
            <div className="border-2 border-accent-6 rounded-xl p-6 bg-primary-4 mb-6">
              <h3 className="text-lg font-bold text-accent-6 mb-2">Prayer</h3>
              <p className="text-secondary-8">{currentDevotion.prayer}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 border-2 border-accent-6 text-accent-6 rounded-full font-bold hover:bg-accent-6 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={20} weight="bold" />
              Previous
            </button>

            <div className="text-sm text-secondary-6">
              {completedIds.includes(currentDevotion._id) && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={16} weight="fill" />
                  Completed
                </span>
              )}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-accent-6 text-white rounded-full font-bold hover:bg-accent-7"
            >
              {currentIndex === devotions.length - 1 ? "Complete" : "Next"}
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DevotionPlanViewer;

