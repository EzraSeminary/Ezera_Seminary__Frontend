import { useParams, useNavigate } from "react-router-dom";
import { useGetExploreItemQuery } from "@/redux/api-slices/apiSlice";
import ExploreItemViewer from "./ExploreItemViewer";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ExploreItemViewerWrapper() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { data: item, isLoading, isError } = useGetExploreItemQuery(
    { id: itemId! },
    { skip: !itemId }
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <LoadingSpinner text="Loading item..." size="md" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 max-w-md">
          <h2 className="text-xl font-bold text-secondary-8 mb-4">Item Not Found</h2>
          <p className="text-secondary-6 mb-4">The item you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl bg-accent-6 hover:bg-accent-7 text-white font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <ExploreItemViewer item={item} onClose={() => navigate(-1)} />;
}
