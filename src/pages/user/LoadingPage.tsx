import BeatLoader from "react-spinners/BeatLoader";

function LoadingPage() {
  return (
    <div className="h-full flex justify-center items-center min-h-screen">
      <BeatLoader
        color={"#EA9215"}
        loading
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default LoadingPage;
