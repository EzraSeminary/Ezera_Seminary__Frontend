import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";

export const useProgress = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const updateProgress = (courseId: string, chapterIndex: number, slideIndex: number) => {
    if (currentUser && currentUser.progress) {
      dispatch(setProgress({ courseId, currentChapter: chapterIndex, currentSlide: slideIndex }));
    }
  };

  const findUserProgress = (courseId: string) => {
    return currentUser?.progress?.find((progress) => progress.courseId === courseId);
  };

  // Progress and completion states
  const [isSlideComplete, setIsSlideComplete] = useState<boolean>(false);
  const [isQuizAnswered, setIsQuizAnswered] = useState<boolean>(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [isRevealFlipped, setIsRevealFlipped] = useState<boolean>(false);
  const [isSequenceCompleted, setIsSequenceCompleted] = useState<boolean>(false);
  const [isRangeChanged, setIsRangeChanged] = useState<boolean>(false);
  const [isDndCompleted, setIsDndCompleted] = useState<boolean>(false);
  const [isAudioPlayed, setIsAudioPlayed] = useState<boolean>(false);

  return {
    updateProgress,
    findUserProgress,
    isSlideComplete,
    setIsSlideComplete,
    isQuizAnswered,
    setIsQuizAnswered,
    isAccordionExpanded,
    setIsAccordionExpanded,
    isRevealFlipped,
    setIsRevealFlipped,
    isSequenceCompleted,
    setIsSequenceCompleted,
    isRangeChanged,
    setIsRangeChanged,
    isDndCompleted,
    setIsDndCompleted,
    isAudioPlayed,
    setIsAudioPlayed,
  };
};