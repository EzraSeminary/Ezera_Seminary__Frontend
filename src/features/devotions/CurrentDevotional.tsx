import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { DownloadSimple, PencilSimpleLine, Trash, Heart, Share, ChatCircle, X } from "@phosphor-icons/react";
import { 
  useGetDevotionsQuery,
  useToggleLikeDevotionMutation,
  useGetDevotionLikesQuery,
  useAddDevotionCommentMutation,
  useGetDevotionCommentsQuery,
  useDeleteDevotionCommentMutation,
  useTrackDevotionShareMutation,
  useGetDevotionSharesQuery,
} from "../../redux/api-slices/apiSlice";
import { selectDevotion, deleteDevotion, setIsEditing } from "../../redux/devotionsSlice";
import { RootState, Devotion } from "@/redux/types";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import prayerImage from "@/assets/prayerImg.png";
import LoadingSpinner from "@/components/LoadingSpinner";

interface CurrentDevotionalProps {
  devotionToDisplay: Devotion;
  showControls: boolean;
  toogleForm: () => void;
}

Modal.setAppElement("#root");

const CurrentDevotional: React.FC<CurrentDevotionalProps> = ({
  devotionToDisplay,
  showControls,
  toogleForm,
}) => {
  const { refetch } = useGetDevotionsQuery();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [devotionToDelete, setDevotionToDelete] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // Like, comment, and share hooks
  const devotionId = devotionToDisplay?._id || "";
  const [toggleLike] = useToggleLikeDevotionMutation();
  const { data: likesData, refetch: refetchLikes } = useGetDevotionLikesQuery(devotionId, { skip: !devotionId });
  const [addComment] = useAddDevotionCommentMutation();
  const { data: commentsData, refetch: refetchComments } = useGetDevotionCommentsQuery(devotionId, { skip: !devotionId });
  const [deleteComment] = useDeleteDevotionCommentMutation();
  const [trackShare] = useTrackDevotionShareMutation();
  const { data: sharesData, refetch: refetchShares } = useGetDevotionSharesQuery(devotionId, { skip: !devotionId });
  
  // Get likes, shares, and isLiked status
  const likesCount = likesData?.likesCount || devotionToDisplay?.likesCount || 0;
  const sharesCount = sharesData?.sharesCount || devotionToDisplay?.sharesCount || 0;
  const isLiked = likesData?.isLiked || devotionToDisplay?.isLiked || false;

  const handleDelete = async (id: string) => {
    // One typescript error below to fix ❗❗❗
    // eslint-disable-next-line
    // @ts-expect-error
    await dispatch(deleteDevotion(id));
    toast.success("Devotion deleted successfully!");
    refetch();
    setModalIsOpen(false);
  };

  const startEditing = (devotion: Devotion) => {
    dispatch(selectDevotion(devotion));
    dispatch(setIsEditing(true));
    toogleForm();
  };

  const handleDownload = () => {
    if (devotionToDisplay && typeof devotionToDisplay.image === "string") {
      const imageUrl = devotionToDisplay.image;
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${devotionToDisplay.title}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error downloading image:", error);
        });
    } else {
      console.error("Invalid image URL");
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleLike = async () => {
    if (!user) {
      toast.info("Please log in to like devotions");
      return;
    }
    if (!devotionId) return;
    
    try {
      await toggleLike(devotionId).unwrap();
      refetchLikes();
      // Also refetch devotions to update the count in the list
      refetch();
    } catch (error) {
      toast.error("Failed to like devotion");
      console.error("Error liking devotion:", error);
    }
  };

  const handleShare = async () => {
    if (!user) {
      toast.info("Please log in to share devotions");
      return;
    }

    const shareUrl = window.location.href;
    const shareText = `Check out this daily devotional: ${devotionToDisplay.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: devotionToDisplay.title,
          text: shareText,
          url: shareUrl,
        });
        
        // Track the share in the backend
        if (devotionId) {
          try {
            await trackShare(devotionId).unwrap();
            refetchShares();
            refetch(); // Also refetch devotions to update the count in the list
          } catch (error) {
            console.error("Error tracking share:", error);
            // Don't show error to user, share was successful
          }
        }
        
        toast.success("Shared successfully!");
      } catch (error: unknown) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== "AbortError") {
          // Copy to clipboard as fallback
          copyToClipboard(shareUrl);
          
          // Track the share even when copying to clipboard
          if (devotionId) {
            try {
              await trackShare(devotionId).unwrap();
              refetchShares();
              refetch();
            } catch (err) {
              console.error("Error tracking share:", err);
            }
          }
        }
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard(shareUrl);
      
      // Track the share when copying to clipboard
      if (devotionId) {
        try {
          await trackShare(devotionId).unwrap();
          refetchShares();
          refetch();
        } catch (error) {
          console.error("Error tracking share:", error);
        }
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success("Link copied to clipboard!"),
      () => toast.error("Failed to copy link")
    );
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.info("Please log in to comment");
      return;
    }
    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    if (!devotionId) return;

    try {
      await addComment({ id: devotionId, text: commentText }).unwrap();
      setCommentText("");
      refetchComments();
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!devotionId) return;
    
    try {
      await deleteComment({ id: devotionId, commentId }).unwrap();
      refetchComments();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error("Error deleting comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="h-auto border-2 shadow-2xl rounded-2xl px-4 md:px-6 pb-6 lg:p-8 md:w-[90%] mx-auto border-accent-6 bg-gradient-to-br from-white to-primary-2">
        <div className="flex flex-col justify-center lg:flex-row lg:space-x-8">
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Delete Confirmation"
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
              },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '8px',
                padding: '20px',
                border: 'none',
                width: '90%',
                maxWidth: '500px',
              },
            }}
          >
            <h2 className="text-2xl font-bold text-secondary-6 mb-4">
              Are you sure you want to delete this devotion?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  if (devotionToDelete) {
                    handleDelete(devotionToDelete);
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
          </Modal>

          {/* Months and days - Enhanced Design */}
          <div className="flex items-center justify-between w-full gap-5 md:gap-8 lg:gap-0 lg:block lg:w-[15%]">
            <div className="w-[35%] md:w-[25%] lg:w-full">
              {devotionToDisplay &&
              (devotionToDisplay.month !== "" || devotionToDisplay.day !== "") ? (
                <div className="rounded-xl lg:w-full h-full border-2 bg-gradient-to-br from-white to-primary-1 border-accent-6 shadow-lg mt-8 text-secondary-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="w-[95%] h-[95%] mx-auto flex flex-col justify-center items-center border-2 bg-gradient-to-br from-secondary-6 to-secondary-7 rounded-xl my-1 lg:leading-none py-6 shadow-inner">
                    <p className="font-nokia-bold md:text-2xl lg:text-xl xl:text-2xl text-white drop-shadow-lg">{devotionToDisplay.month}</p>
                    <p className="font-nokia-bold md:text-5xl lg:text-6xl xl:text-7xl text-white md:-mt-3 drop-shadow-lg">{devotionToDisplay.day}</p>
                  </div>
                </div>
              ) : (
                <div className="hidden rounded-xl lg:w-full h-full border-2 bg-[#fff] border-accent-5 mt-8 text-secondary-6">
                  <div className="w-[90%] mx-auto h-[95%] flex flex-col justify-center items-center border-2 bg-secondary-6 rounded-xl my-1 leading-none py-6">
                    <p className="font-nokia-bold md:text-2xl text-[#fff]">{devotionToDisplay?.month}</p>
                    <p className="font-nokia-bold md:text-5xl text-[#fff] -mt-3">{devotionToDisplay?.day}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="w-[60%] self-end flex-grow lg:hidden">
              <h1 className="text-2xl md:text-4xl text-secondary-6 font-bold">{devotionToDisplay?.title}</h1>
              <h4 className="flex gap-2 text-sm md:text-xl text-secondary-6 w-full mt-2">
                የዕለቱ የመጽሐፍ ቅዱስ ንባብ ክፍል -
              </h4>
              <h2 className="text-sm md:text-xl text-accent-6 font-bold">{devotionToDisplay?.chapter}</h2>
            </div>
          </div>

          {/* Devotion contents - Enhanced Design */}
          <div className="font-nokia-bold flex flex-col lg:w-[50%] space-y-4 mt-3 lg:mt-8 mx-auto">
            {/* Devotion title and controls */}
            <div className="flex w-[100%] gap-x-[1vw] items-start">
              <h1 className="hidden lg:block lg:text-4xl xl:text-5xl text-secondary-8 font-bold leading-tight">{devotionToDisplay.title}</h1>
              {(role === "Admin" || "Instructor") && showControls && (
                <div className="flex gap-2 ml-auto">
                  <Trash
                    size={28}
                    className="text-red-600 hover:text-red-700 text-xl cursor-pointer self-center transition-colors"
                    onClick={() => {
                      setDevotionToDelete(devotionToDisplay?._id || "");
                      setModalIsOpen(true);
                    }}
                  />
                  <PencilSimpleLine
                    size={28}
                    className="text-gray-600 hover:text-gray-800 text-xl cursor-pointer self-center transition-colors"
                    onClick={() => startEditing(devotionToDisplay)}
                  />
                </div>
              )}
            </div>

            {/* Devotion chapter - Enhanced */}
            <div className="hidden lg:flex flex-col gap-2">
              <h4 className="text-xl xl:text-2xl text-secondary-7 font-semibold">
                የዕለቱ የመጽሐፍ ቅዱስ ንባብ ክፍል
              </h4>
              <p className="text-2xl xl:text-3xl text-accent-6 font-bold">{devotionToDisplay.chapter}</p>
            </div>

            {/* Devotion verse - Enhanced */}
            <div className="bg-gradient-to-r from-accent-6/10 to-accent-7/10 rounded-lg p-4 border-l-4 border-accent-6">
              <p className="text-base md:text-lg xl:text-2xl text-accent-7 font-bold leading-relaxed">{devotionToDisplay.verse}</p>
            </div>

            {devotionToDisplay.chapter !== "" && <hr className="border-2 border-accent-6/30 my-2" />}

            {/* Devotion paragraphs - Enhanced */}
            <div className="space-y-4">
              {devotionToDisplay.body.map((paragraph, paragraphIndex) => (
                <div
                  key={paragraphIndex}
                  className="font-nokia-bold text-justify text-secondary-7 text-base md:text-lg xl:text-xl leading-relaxed rich-text-container"
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}
            </div>

            {/* Devotion prayer - Enhanced Design */}
            <div className="relative border-2 border-accent-6 rounded-xl bg-gradient-to-br from-accent-6/5 to-accent-7/5 text-accent-7 shadow-lg mt-6">
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-accent-6 to-accent-7 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                <img src={prayerImage} alt="Prayer" className="w-7 h-7" />
              </div>
              <p className="font-nokia-bold text-lg md:text-xl xl:text-2xl text-center px-8 py-6 leading-relaxed">{devotionToDisplay.prayer}</p>
            </div>

            {/* Like, Share, Comment Section - Only visible when logged in */}
            {user && (
              <div className="mt-6 pt-6 border-t-2 border-accent-6/30">
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-nokia-bold transition-all ${
                      isLiked
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Heart weight={isLiked ? "fill" : "regular"} size={20} />
                    <span>{likesCount}</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-nokia-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                  >
                    <Share size={20} />
                    <span>Share ({sharesCount})</span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-nokia-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                  >
                    <ChatCircle size={20} />
                    <span>Comment ({commentsData?.count || 0})</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments && (
                  <div className="mt-6 space-y-4">
                    {/* Add Comment Form */}
                    <div className="border-2 border-accent-6/30 rounded-lg p-4 bg-white">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent-6 font-nokia-bold resize-none"
                        rows={3}
                      />
                      <button
                        onClick={handleAddComment}
                        className="mt-3 px-6 py-2 bg-gradient-to-r from-accent-6 to-accent-7 text-white rounded-lg font-nokia-bold hover:from-accent-7 hover:to-accent-6 transition-all"
                      >
                        Post Comment
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {commentsData?.comments && commentsData.comments.length > 0 ? (
                        commentsData.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className="border-2 border-accent-6/30 rounded-lg p-4 bg-white"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-6 to-accent-7 flex items-center justify-center text-white font-bold">
                                    {comment.user?.firstName?.[0] || "U"}
                                  </div>
                                  <div>
                                    <p className="font-nokia-bold text-sm text-gray-700">
                                      {comment.user?.firstName} {comment.user?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatDate(comment.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-gray-800 font-nokia-bold">{comment.text}</p>
                              </div>
                              {(user._id === comment.user?._id || role === "Admin" || role === "Instructor") && (
                                <button
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                                  title="Delete comment"
                                >
                                  <X size={20} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 font-nokia-bold py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Devotion image - Enhanced Design */}
          <div className="w-full md:w-[60%] mx-auto lg:w-[30%] h-full mt-6 lg:mt-12 border-2 border-accent-6 rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-1 to-primary-2">
          {isImageLoading && (
              <div className="flex items-center justify-center h-full my-8">
                <LoadingSpinner />
              </div>
            )}
            <img
              src={typeof devotionToDisplay?.image === "string" ? devotionToDisplay.image : undefined}
              alt="Devotion Image"
              className={`h-full rounded-xl p-2 object-cover transition-transform duration-300 hover:scale-105 ${isImageLoading ? 'hidden' : ''}`}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
              onLoad={handleImageLoad}
            />

            {devotionToDisplay && typeof devotionToDisplay.previewUrl === "string" && (
              <img src={devotionToDisplay.previewUrl} alt="Preview" />
            )}

            <div className="flex gap-2 justify-center my-3 w-[90%] mx-auto">
              <button
                className="flex text-sm xl:text-base w-max items-center gap-2 xl:gap-3 px-4 py-2 border-2 border-accent-6 bg-gradient-to-r from-accent-6 to-accent-7 rounded-xl font-nokia-bold text-white hover:from-accent-7 hover:to-accent-6 transition-all shadow-md hover:shadow-lg"
                onClick={handleDownload}
              >
                ምስሉን አውርድ
                <DownloadSimple
                  weight="bold"
                  className="text-white text-sm md:text-base lg:text-lg xl:text-xl"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

CurrentDevotional.propTypes = {
  showControls: PropTypes.bool.isRequired,
};

export default CurrentDevotional;