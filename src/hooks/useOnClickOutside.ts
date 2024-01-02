import { useEffect, RefObject } from "react";

type HandleAccountClick = () => void;

export const useOnClickOutside = (
  ref: RefObject<HTMLElement>,
  currentState: boolean,
  handleAccountClick: HandleAccountClick
): void => {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (currentState && ref.current && !ref.current.contains(event.target as Node)) {
        handleAccountClick();
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [ref, currentState, handleAccountClick]);
};