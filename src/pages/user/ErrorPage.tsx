import { FallbackProps } from "react-error-boundary";

function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-3xl font-nokia-bold text-secondary-5 mb-2">
        An error occurred !! 🌎
      </h1>
      <p className="text-xl font-nokia-bold text-secondary-8">
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="bg-secondary-3 hover:bg-secondary-4 text-sm font-nokia-bold px-3 py-1 mt-2 rounded-3xl transition-all"
      >
        Try again
      </button>
    </div>
  );
}

export default ErrorPage;
