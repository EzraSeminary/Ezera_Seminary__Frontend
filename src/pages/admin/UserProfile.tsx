import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "@/redux/api-slices/apiSlice";
import { ArrowLeft, User, Calendar, BookOpen, CheckCircle, Play, Pause } from "@phosphor-icons/react";
import LoadingPage from "../user/LoadingPage";
import { Progress } from "@/redux/types";

interface CourseProgress {
  courseId: string;
  currentChapter: number;
  currentSlide: number;
  courseTitle?: string;
  totalChapters?: number;
  totalSlides?: number;
  lastAccessed?: string;
}

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  
  const { data: user, isLoading, error } = useGetUserByIdQuery(id || "", {
    skip: !id,
  });

  useEffect(() => {
    if (user && user.progress) {
      // In a real app, you'd fetch course details for each progress entry
      // For now, we'll create mock data based on the progress
      const progressWithDetails = user.progress.map((progress: Progress, index: number) => ({
        ...progress,
        courseTitle: `Course ${index + 1}`,
        totalChapters: Math.floor(Math.random() * 10) + 5,
        totalSlides: Math.floor(Math.random() * 50) + 20,
        lastAccessed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      setCourseProgress(progressWithDetails);
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressIcon = (percentage: number) => {
    if (percentage >= 80) return <CheckCircle size={20} className="text-green-600" weight="fill" />;
    if (percentage >= 50) return <Play size={20} className="text-yellow-600" weight="fill" />;
    return <Pause size={20} className="text-red-600" weight="fill" />;
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-6 to-secondary-7 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h1>
            <p className="text-secondary-6 mb-6">The user you're looking for doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-accent-6 hover:bg-accent-7 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-6 to-secondary-7 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-accent-2">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-accent-6 hover:bg-accent-7 text-white font-bold px-4 py-2 rounded-xl transition-all duration-200"
            >
              <ArrowLeft size={20} weight="fill" />
              Back to Users
            </button>
            <h1 className="text-3xl font-nokia-bold text-primary-6">User Profile</h1>
          </div>
          
          {/* User Info Card */}
          <div className="flex items-start gap-6">
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-24 h-24 rounded-full border-4 border-accent-6 object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-nokia-bold text-primary-6 mb-2">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-secondary-7 text-lg mb-4">{user.email}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-secondary-7">
                  <User size={20} weight="fill" />
                  <span className="font-medium">{user.role}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-7">
                  <Calendar size={20} weight="fill" />
                  <span className="font-medium">Joined {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-7">
                  <BookOpen size={20} weight="fill" />
                  <span className="font-medium">{user.progress?.length || 0} Courses Started</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Progress Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-accent-2">
          <h3 className="text-2xl font-nokia-bold text-primary-6 mb-6 flex items-center gap-2">
            <BookOpen size={24} weight="fill" />
            Course Progress
          </h3>
          
          {courseProgress.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={64} className="text-secondary-4 mx-auto mb-4" />
              <p className="text-secondary-7 text-lg">No courses started yet</p>
              <p className="text-secondary-5">This user hasn't enrolled in any courses</p>
            </div>
          ) : (
            <div className="space-y-6">
              {courseProgress.map((progress, index) => {
                const chapterPercentage = getProgressPercentage(progress.currentChapter, progress.totalChapters || 1);
                const slidePercentage = getProgressPercentage(progress.currentSlide, progress.totalSlides || 1);
                
                return (
                  <div key={index} className="border border-accent-2 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-primary-6 mb-2">
                          {progress.courseTitle}
                        </h4>
                        <p className="text-secondary-7 mb-3">
                          Last accessed: {formatDate(progress.lastAccessed || '')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getProgressIcon(chapterPercentage)}
                        <span className={`font-bold text-lg ${getProgressColor(chapterPercentage)}`}>
                          {chapterPercentage}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="space-y-4">
                      {/* Chapter Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-secondary-7">
                            Chapter Progress: {progress.currentChapter} / {progress.totalChapters}
                          </span>
                          <span className="text-sm font-medium text-secondary-7">
                            {chapterPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-accent-2 rounded-full h-3">
                          <div 
                            className="bg-accent-6 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${chapterPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Slide Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-secondary-7">
                            Slide Progress: {progress.currentSlide} / {progress.totalSlides}
                          </span>
                          <span className="text-sm font-medium text-secondary-7">
                            {slidePercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-accent-2 rounded-full h-3">
                          <div 
                            className="bg-accent-4 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${slidePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Current Position */}
                    <div className="mt-4 pt-4 border-t border-accent-1">
                      <div className="flex items-center gap-2 text-sm text-secondary-7">
                        <span className="font-medium">Current Position:</span>
                        <span className="bg-accent-1 px-3 py-1 rounded-full text-secondary-6">
                          Chapter {progress.currentChapter}, Slide {progress.currentSlide}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-2 text-center">
            <div className="text-3xl font-bold text-accent-6 mb-2">
              {courseProgress.length}
            </div>
            <div className="text-secondary-7">Courses Enrolled</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-2 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {courseProgress.filter(p => getProgressPercentage(p.currentChapter, p.totalChapters || 1) >= 80).length}
            </div>
            <div className="text-secondary-7">Courses Near Completion</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-2 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {user.achievement || 0}
            </div>
            <div className="text-secondary-7">Achievement Points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
