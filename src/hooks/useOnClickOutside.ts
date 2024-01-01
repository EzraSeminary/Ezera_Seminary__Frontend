import { useEffect } from "react";

// A custom Hook that we can reuse.
export const useOnClickOutside = (ref, currentState, handleAccountClick) => {
  useEffect(() => {
    const handler = (event) => {
      if (currentState && ref.current && !ref.current.contains(event.target)) {
        handleAccountClick();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
    };
  }, [ref, currentState, handleAccountClick]);
};
