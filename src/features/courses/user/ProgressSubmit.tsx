import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';

interface ProgressSubmitProps {
  courseId: string;
  chapterIndex: number | undefined;
  currentSlideNumber: number;
  updateProgress: (courseId: string, chapterIndex: number, slideIndex: number) => void;
}

const ProgressSubmit = forwardRef<{ submitProgress: () => void }, ProgressSubmitProps>(({
  courseId,
  chapterIndex,
  currentSlideNumber,
  updateProgress,
}, ref) => {
  const [progressLoading, setProgressLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem('token');
  const userId = currentUser?._id;

  const submitProgress = () => {
    if (currentUser && currentUser.progress) {
      setProgressLoading(true);
      axios
        .put(
          '/users/profile/' + userId,
          {
            userId: currentUser._id,
            progress: currentUser.progress,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log('Progress updated successfully:', res.data);
          setProgressLoading(false);
          if (chapterIndex !== undefined) {
            updateProgress(courseId, chapterIndex, currentSlideNumber - 1);
          }
          navigate(`/courses/get/${courseId}`);
        })
        .catch((err) => {
          console.error(
            'Error updating progress:',
            err.response ? err.response.data : err.message
          );
          toast.error(
            'Could not update progress: ' +
              (err.response ? err.response.data : err.message)
          );
          setProgressLoading(false);
          navigate(`/courses/get/${courseId}`);
        });
    } else {
      navigate(`/courses/get/${courseId}`);
    }
  };

  useImperativeHandle(ref, () => ({

    submitProgress,

  }));

  return (
    <>
      {progressLoading ? (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-secondary-6 bg-opacity-85 z-50">
          <PuffLoader
            color={"#EA9215"}
            loading
            size={56}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <h1 className="text-accent-6 font-nokia-bold text-2xl mt-4">
            Saving your progress
          </h1>
        </div>
      ) : null}
    </>
  );
});

export default ProgressSubmit;