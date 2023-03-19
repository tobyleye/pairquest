import { useState, useEffect } from "react";

export function useWindowFocused() {
  const [visibilityState, setVisibilityState] = useState(
    document.visibilityState
  );

  useEffect(() => {
    const handler = () => {
      setVisibilityState(document.visibilityState);
    };
    document.addEventListener("visibilitychange", handler);
    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, []);

  const focused = visibilityState === "visible";

  return focused;
}
