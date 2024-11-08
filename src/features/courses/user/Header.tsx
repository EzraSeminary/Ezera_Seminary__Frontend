import React, { useState, useRef } from 'react';
import { DotsThreeVertical, X } from '@phosphor-icons/react';
import logo from '../../../assets/ezra-logo.svg';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import ProgressSubmit from './ProgressSubmit';

interface HeaderSectionProps {
  currentSlideNumber: number;
  totalDataNumber: number;
  handleArrowClick: () => void;
  courseId: string;
  chapterIndex: number | undefined;
  updateProgress: (courseId: string, chapterIndex: number, slideIndex: number) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  currentSlideNumber,
  totalDataNumber,
  handleArrowClick,
  courseId,
  chapterIndex,
  updateProgress,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, open, () => setOpen(false));

  const progressSubmitRef = useRef<{ submitProgress: () => void }>(null);

  return (
    <div>
      <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
        <div className="h-full flex justify-center items-center md:space-x-0 xl:space-x-1 cursor-pointer ">
          <img src={logo} className="w-8 h-5 md:w-10 md:h-6 " alt="" />
          <h3 className="text-white font-nokia-bold text-xs md:text-sm ">
            <strong>Ezra</strong> Seminary
          </h3>
        </div>
        <p className="hidden lg:block font-nokia-bold text-primary-6 text-xs lg:text-sm">
          {currentSlideNumber} / {totalDataNumber}
        </p>
        <div className="flex lg:hidden items-center">
          <DotsThreeVertical
            onClick={handleArrowClick}
            className="block lg:hidden font-bold text-xl cursor-pointer text-primary-6 transition-all "
          />
          <X
            onClick={() => {
              if (progressSubmitRef.current) {
                progressSubmitRef.current.submitProgress();
              }
            }}
            className="text-primary-5 text-xl bg-accent-6 border p-1 rounded-full cursor-pointer"
          />
        </div>
      </div>
      <hr className="border-accent-5 border-1 w-[90%] mx-auto" />
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

export default HeaderSection;