import { useState, useEffect } from "react";

export function useCountdown({ seconds, onDone }) {
  const [countdown, setCountdown] = useState(seconds);
  useEffect(() => {
    let id;
    if (countdown > 0) {
      id = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      id && clearTimeout(id);
    };
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0 && onDone) {
        onDone()
    }
  }, [countdown, onDone])

  return countdown
}
