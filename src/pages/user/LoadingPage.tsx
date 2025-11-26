import LoadingSpinner from "@/components/LoadingSpinner";

function LoadingPage() {
  return (
    <div className="h-full flex justify-center items-center min-h-screen">
      <LoadingSpinner text="Loading..." size="md" />
    </div>
  );
}

export default LoadingPage;
