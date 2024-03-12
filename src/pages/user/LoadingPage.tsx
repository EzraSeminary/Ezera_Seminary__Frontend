import BeatLoader from "react-spinners/BeatLoader";

function LoadingPage() {
  return (
    <div className="h-full flex justify-center items-center">
      <BeatLoader
        color={"#707070"}
        loading
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default LoadingPage;
