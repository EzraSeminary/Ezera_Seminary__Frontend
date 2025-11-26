import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPlanDevotionsQuery, useGetDevotionPlanByIdQuery, useUpdateDevotionPlanProgressMutation, useGetDevotionPlanProgressQuery, useRestartDevotionPlanMutation } from "@/redux/api-slices/apiSlice";
import { CaretLeft, CaretRight, CheckCircle, Circle, Trophy, Sparkle, ArrowClockwise } from "@phosphor-icons/react";
import prayerImage from "@/assets/prayerImg.png";
import LoadingSpinner from "@/components/LoadingSpinner";
import Footer from "@/components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlanDevotionViewer = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: planData, isLoading: planLoading } = useGetDevotionPlanByIdQuery(planId || "");
  const { data: devotionsData, isLoading: devotionsLoading } = useGetPlanDevotionsQuery({ id: planId || "" });
  const { data: progressData, refetch: refetchProgress } = useGetDevotionPlanProgressQuery(planId || "", { skip: !planId });
  const [updateProgress] = useUpdateDevotionPlanProgressMutation();
  const [restartPlan] = useRestartDevotionPlanMutation();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const devotions = devotionsData?.items || [];
  const completedItems = progressData?.progress?.completed || 0;
  const totalItems = progressData?.progress?.total || devotions.length;
  const itemsCompleted = progressData?.userPlan?.itemsCompleted || [];
  const planStatus = progressData?.userPlan?.status || "in_progress";
  const isPlanCompleted = planStatus === "completed" || (totalItems > 0 && completedItems >= totalItems);

  const currentDevotion = devotions[currentIndex];
  const isCompleted = currentDevotion && itemsCompleted.some(
    (id: string) => id.toString() === currentDevotion._id.toString()
  );
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  useEffect(() => {
    // Find the first uncompleted devotion, or start from the beginning
    if (devotions.length > 0) {
      const firstIncompleteIndex = devotions.findIndex(
        (dev: any) => !itemsCompleted.some(
          (id: string) => id.toString() === dev._id.toString()
        )
      );
      if (firstIncompleteIndex !== -1) {
        setCurrentIndex(firstIncompleteIndex);
      } else {
        // All completed, show the last one
        setCurrentIndex(devotions.length - 1);
      }
    }
  }, [devotions, itemsCompleted]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentIndex < devotions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleToggleComplete = async () => {
    if (!planId || !currentDevotion) return;
    
    try {
      const wasCompleted = isCompleted;
      await updateProgress({
        id: planId,
        devotionId: currentDevotion._id,
        completed: !isCompleted,
      }).unwrap();
      
      // Refetch progress to get updated data
      const updatedProgress = await refetchProgress();
      const newCompletedItems = updatedProgress.data?.progress?.completed || 0;
      const newTotalItems = updatedProgress.data?.progress?.total || totalItems;
      const newStatus = updatedProgress.data?.userPlan?.status;
      
      // Show toast notification
      if (!wasCompleted) {
        toast.success(`Day ${currentIndex + 1} marked as complete! 🎉`, {
          position: "top-center",
          autoClose: 2000,
        });
        
        // Check if plan is now completed
        if (newStatus === "completed" || (newTotalItems > 0 && newCompletedItems >= newTotalItems)) {
          setTimeout(() => {
            setShowCompletionModal(true);
          }, 500);
        } else {
          // Auto-advance to next incomplete devotion
          const nextIncompleteIndex = devotions.findIndex(
            (dev: any, idx: number) => idx > currentIndex && !updatedProgress.data?.userPlan?.itemsCompleted.some(
              (id: string) => id.toString() === dev._id.toString()
            )
          );
          if (nextIncompleteIndex !== -1) {
            setTimeout(() => {
              setCurrentIndex(nextIncompleteIndex);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, 500);
          }
        }
      } else {
        toast.info("Day marked as incomplete", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    navigate("/devotion");
  };

  const handleRestartPlan = async () => {
    if (!planId) return;
    try {
      await restartPlan(planId).unwrap();
      await refetchProgress();
      setCurrentIndex(0);
      setShowCompletionModal(false);
      toast.success("Plan restarted! Start your journey again.", {
        position: "top-center",
      });
      // Navigate back to plans page so user can see it in "My Plans"
      setTimeout(() => {
        navigate("/devotion");
      }, 1000);
    } catch (error) {
      console.error("Error restarting plan:", error);
      toast.error("Failed to restart plan. Please try again.");
    }
  };

  if (planLoading || devotionsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!planData || devotions.length === 0) {
    return (
      <div className="absolute top-0 w-full font-nokia-bold">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold text-secondary-6 mb-4">Plan not found</h2>
          <button
            onClick={() => navigate("/devotion")}
            className="px-6 py-2 bg-accent-6 text-white rounded-lg hover:bg-accent-7"
          >
            Back to Devotion Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 w-full font-nokia-bold">
      <ToastContainer />
      
      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-gradient-to-r from-accent-6 to-accent-7 rounded-full p-6">
                <Trophy size={64} weight="fill" className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-secondary-8 mb-4">
              Congratulations! 🎉
            </h2>
            <p className="text-lg text-secondary-6 mb-2">
              You've completed <span className="font-bold text-accent-6">{planData.title}</span>
            </p>
            <p className="text-sm text-secondary-4 mb-6">
              You've finished all {totalItems} days of this devotion plan!
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleCloseCompletionModal}
                className="flex-1 px-6 py-3 bg-accent-6 text-white rounded-xl font-bold hover:bg-accent-7 transition-colors"
              >
                Back to Plans
              </button>
              <button
                onClick={handleRestartPlan}
                className="flex-1 px-6 py-3 border-2 border-accent-6 text-accent-6 rounded-xl font-bold hover:bg-accent-6 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <ArrowClockwise size={20} weight="bold" />
                Restart Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with plan info and progress - Added margin-top for nav bar */}
      <div className="bg-gradient-to-r from-accent-6 to-accent-7 text-white py-6 px-4 mt-16 lg:mt-20 xl:mt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{planData.title}</h1>
          <p className="text-white/90 text-sm md:text-base mb-4">{planData.description}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-2 relative overflow-hidden">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              {progressPercent > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              )}
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2">
              <Sparkle size={16} weight="fill" className={isPlanCompleted ? "text-yellow-300" : "text-white/60"} />
              Day {currentIndex + 1} of {totalItems}
            </span>
            <span className="font-bold">
              {completedItems} of {totalItems} completed {isPlanCompleted && "✓"}
            </span>
          </div>
        </div>
      </div>

      {/* Devotion Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white border-2 border-accent-6 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Day Number Card */}
            <div className="w-full lg:w-[15%] flex-shrink-0">
              <div className="rounded-xl border-2 border-accent-5 bg-white text-secondary-6 relative">
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 z-10">
                    <CheckCircle size={24} weight="fill" className="text-white" />
                  </div>
                )}
                <div className={`w-full mx-auto flex flex-col justify-center items-center border-2 rounded-xl p-6 transition-all ${
                  isCompleted ? "bg-green-600" : "bg-secondary-6"
                }`}>
                  <p className="font-nokia-bold text-2xl text-white">Day</p>
                  <p className="font-nokia-bold text-5xl text-white">{currentIndex + 1}</p>
                </div>
              </div>
            </div>

            {/* Devotion Content */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl md:text-4xl font-bold text-secondary-6 flex-1">{currentDevotion.title}</h1>
                <button
                  onClick={handleToggleComplete}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    isCompleted
                      ? "border-green-600 bg-green-50 hover:bg-green-100 text-green-700"
                      : "border-accent-6 hover:bg-accent-6 hover:text-white text-accent-6"
                  }`}
                  title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle size={24} weight="fill" className="text-green-600" />
                      <span className="hidden md:inline font-bold">Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle size={24} weight="regular" />
                      <span className="hidden md:inline font-bold">Mark Complete</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Completion Status Badge */}
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                  <CheckCircle size={20} weight="fill" />
                  <span>You've completed this day!</span>
                </div>
              )}

              <h4 className="text-lg md:text-xl text-secondary-6">
                የዕለቱ የመጽሐፍ ቅዱስ ንባብ ክፍል - <span className="text-accent-6">{currentDevotion.chapter}</span>
              </h4>

              <p className="text-base md:text-xl text-accent-6">{currentDevotion.verse}</p>

              {currentDevotion.chapter && <hr className="border-accent-6" />}

              {/* Devotion paragraphs */}
              {currentDevotion.body?.map((paragraph: string, paragraphIndex: number) => (
                <div
                  key={paragraphIndex}
                  className="font-nokia-bold text-justify text-secondary-6 space-y-3 rich-text-container"
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}

              {/* Prayer Section */}
              {currentDevotion.prayer && (
                <div className="relative border-2 border-accent-5 rounded-lg text-accent-5 mt-6">
                  <p className="font-nokia-bold text-lg text-center px-8 py-4">{currentDevotion.prayer}</p>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-5 bg-accent-6 rounded-full w-max p-3">
                    <img src={prayerImage} alt="Prayer" className="w-8 h-8" />
                  </div>
                </div>
              )}
            </div>

            {/* Devotion Image */}
            {currentDevotion.image && (
              <div className="w-full lg:w-[30%] flex-shrink-0">
                <div className="border-2 border-accent-5 rounded-xl overflow-hidden">
                  <img
                    src={currentDevotion.image}
                    alt={currentDevotion.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-accent-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-accent-6 text-white hover:bg-accent-7"
              }`}
            >
              <CaretLeft size={20} weight="bold" />
              Previous
            </button>

            <div className="text-sm text-secondary-6">
              {currentIndex + 1} / {devotions.length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === devotions.length - 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                currentIndex === devotions.length - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-accent-6 text-white hover:bg-accent-7"
              }`}
            >
              Next
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlanDevotionViewer;

