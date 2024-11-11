import React, { useState, useRef } from 'react';
import ProgressSubmit from './ProgressSubmit';

interface FooterNavigationProps {
  activeIndex: number;
  totalDataNumber: number;
  currentSlideNumber: number;
  isLastSlide: boolean;
  shouldShowNextButton: boolean;
  updateIndex: (index: number) => void;
  moveToNextSlide: () => void;
  courseId: string;
  chapterIndex: number | undefined;
  updateProgress: (courseId: string, chapterIndex: number, slideIndex: number) => void;
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({
  activeIndex,
  totalDataNumber,
  currentSlideNumber,
  isLastSlide,
  shouldShowNextButton,
  updateIndex,
  moveToNextSlide,
  courseId,
  chapterIndex,
  updateProgress,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const progressSubmitRef = useRef<{ submitProgress: () => void }>(null);

  return (
    <div className="mb-4">
      <hr className="border-accent-5 border-1 w-[90%] mx-auto z-50" />
      <div className="flex justify-between items-center w-full relative">
        {/* Back Button */}
        <button
          className={`text-white text-center font-nokia-bold mt-2 bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-lg xl:text-xl lg:py-1 px-2 ${
            activeIndex === 0 ? "hidden" : "block"
          }`}
          onClick={() => {
            updateIndex(activeIndex - 1);
          }}
        >
          ተመለስ
        </button>

        {/* Slide Counter */}
        <p
          className={`block lg:hidden font-nokia-bold text-primary-5 text-xs lg:text-sm pt-2 ${
            activeIndex === 0 ? "hidden" : "block"
          } ${isLastSlide ? "hidden" : "block"}`}
        >
          {currentSlideNumber} / {totalDataNumber}
        </p>

        {/* Tooltip */}
        {!shouldShowNextButton && showTooltip && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-accent-9 text-primary-1 text-sm rounded-md px-3 py-1 shadow-lg">
            Complete all tasks on the slide to proceed
          </div>
        )}

        {/* Next Button */}
        {!isLastSlide ? (
          <button
            className={`text-primary-1 text-center font-nokia-bold mt-2 bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-lg xl:text-xl lg:py-1 px-4 ${
              shouldShowNextButton ? "block" : "text-primary-6 bg-accent-9 hover:bg-accent-9"
            }`}
            onClick={
              shouldShowNextButton
                ? moveToNextSlide
                : () => setShowTooltip(true) // Show tooltip on click when disabled
            }
            onMouseLeave={() => setShowTooltip(false)} // Hide tooltip on mouse leave
          >
            ቀጥል
          </button>
        ) : null}

        {/* Submit Button */}
        <button
          className={`text-primary-5 text-center font-nokia-bold mt-2 bg-accent-6 hover:bg-accent-7 w-auto rounded-3xl mx-auto text-xs1 lg:text-sm lg:py-1 px-4 ${
            isLastSlide ? "block" : "hidden"
          }`}
          onClick={() => {
            if (progressSubmitRef.current) {
              progressSubmitRef.current.submitProgress();
            }
          }}
        >
          ዘግተህ ውጣ
        </button>
      </div>
      <ProgressSubmit
        courseId={courseId}
        chapterIndex={chapterIndex}
        currentSlideNumber={currentSlideNumber}
        updateProgress={updateProgress}
        ref={progressSubmitRef}
      />
    </div>
  );
};

export default FooterNavigation;