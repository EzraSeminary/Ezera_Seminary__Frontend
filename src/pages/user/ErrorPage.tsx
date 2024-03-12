import { FallbackProps } from "react-error-boundary";

function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div>
      <p>An error occurred:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export default ErrorPage;
