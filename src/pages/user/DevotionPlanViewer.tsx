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
import { ArrowLeft, ArrowRight, CheckCircle, BookBookmark, HandsPraying } from "@phosphor-icons/react";
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
      // If plan is completed, show completion screen
      if (myPlan.status === 'completed') {
        setShowCompletion(true);
        return;
      }
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
      <div className="absolute top-0 w-full font-nokia-bold min-h-screen bg-gradient-to-br from-primary-3 to-accent-2">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            {plan.image && (
              <img
                src={plan.image}
                alt={plan.title}
                className="w-full h-96 object-cover"
              />
            )}
            <div className="p-12">
              <BookBookmark size={64} className="mx-auto mb-6 text-accent-6" weight="fill" />
              <h1 className="text-3xl md:text-5xl font-bold text-secondary-8 mb-6">{plan.title}</h1>
              <p className="text-lg md:text-xl text-secondary-6 max-w-2xl mx-auto mb-6 leading-relaxed">
                {plan.description}
              </p>
              <div className="inline-block bg-accent-4 text-accent-8 px-6 py-2 rounded-full text-lg font-bold mb-8">
                {devotions.length} Days Journey
              </div>
              <div>
                <button
                  onClick={handleStart}
                  className="px-12 py-4 bg-accent-6 hover:bg-accent-7 text-white text-xl rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Start Plan →
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div className="absolute top-0 w-full font-nokia-bold min-h-screen bg-gradient-to-br from-primary-3 to-accent-2">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12">
            {plan?.image && (
              <img
                src={plan.image}
                alt={plan.title}
                className="w-48 h-48 object-cover rounded-full mx-auto mb-6 border-4 border-accent-6 shadow-lg"
              />
            )}
            <CheckCircle size={80} weight="fill" className="text-green-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-secondary-8 mb-4">
              Congratulations! 🎉
            </h2>
            <p className="text-xl text-secondary-6 mb-3">
              You have completed the
            </p>
            <p className="text-2xl font-bold text-accent-6 mb-6">
              {plan?.title}
            </p>
            <p className="text-lg text-secondary-6 mb-8">
              devotion plan with {devotions.length} days of spiritual growth!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowCompletion(false);
                  setCurrentIndex(0);
                }}
                className="px-8 py-3 border-2 border-accent-6 text-accent-6 rounded-full font-bold hover:bg-accent-6 hover:text-white transition-all"
              >
                Review Plan
              </button>
              <button
                onClick={() => navigate("/devotion")}
                className="px-8 py-3 bg-accent-6 hover:bg-accent-7 text-white rounded-full font-bold transition-all shadow-lg"
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
    <div className="absolute top-0 w-full font-nokia-bold min-h-screen bg-primary-3">
      <ToastContainer />
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 fixed top-0 z-50">
        <div
          className="bg-accent-6 h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="w-11/12 max-w-5xl mx-auto py-8 mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/devotion")}
            className="flex items-center gap-2 text-accent-6 font-bold hover:text-accent-7 transition-colors"
          >
            <ArrowLeft size={24} weight="bold" />
            Back
          </button>
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-secondary-8">{plan.title}</h2>
            <p className="text-sm text-secondary-6 mt-1">
              Day {currentIndex + 1} of {devotions.length}
            </p>
          </div>
          <div className="w-20" />
        </div>

        {/* Devotion Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {currentDevotion.image && (
            <img
              src={currentDevotion.image}
              alt={currentDevotion.title}
              className="w-full h-72 object-cover"
            />
          )}

          <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-8 mb-6">
              {currentDevotion.title}
            </h1>

            {/* Scripture Reference */}
            {currentDevotion.chapter && (
              <div className="mb-6 pb-4 border-b border-gray-200">
                <span className="text-sm text-secondary-6 uppercase tracking-wide">Scripture Reading</span>
                <p className="text-xl text-accent-6 font-bold mt-1">{currentDevotion.chapter}</p>
              </div>
            )}

            {/* Verse */}
            {currentDevotion.verse && (
              <div className="border-l-4 border-accent-6 bg-primary-4 rounded-r-xl p-6 mb-8">
                <p className="text-lg text-secondary-8 leading-relaxed">{currentDevotion.verse}</p>
              </div>
            )}

            {/* Body - Display each paragraph with line breaks preserved */}
            {currentDevotion.body && currentDevotion.body.length > 0 && (
              <div className="space-y-4 mb-8 text-secondary-8 leading-relaxed">
                {currentDevotion.body.map((paragraph, idx) => (
                  <p key={idx} className="text-lg whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Prayer */}
            {currentDevotion.prayer && (
              <div className="bg-gradient-to-br from-accent-3 to-accent-4 rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <HandsPraying size={28} weight="fill" className="text-accent-6" />
                  <h3 className="text-xl font-bold text-accent-8">Prayer</h3>
                </div>
                <p className="text-secondary-8 text-lg leading-relaxed whitespace-pre-wrap">
                  {currentDevotion.prayer}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t-2 border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-8 py-3 border-2 border-accent-6 text-accent-6 rounded-full font-bold hover:bg-accent-6 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={20} weight="bold" />
                Previous
              </button>

              <div className="text-sm text-secondary-6">
                {completedIds.includes(currentDevotion._id) && (
                  <span className="flex items-center gap-2 text-green-600 font-bold">
                    <CheckCircle size={20} weight="fill" />
                    Completed
                  </span>
                )}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-accent-6 text-white rounded-full font-bold hover:bg-accent-7 transition-all shadow-md"
              >
                {currentIndex === devotions.length - 1 ? "Complete" : "Next"}
                <ArrowRight size={20} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DevotionPlanViewer;

