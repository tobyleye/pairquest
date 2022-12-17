import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";

export function Confetti({ width, height, duration }) {
  const [stop, setStop] = useState(false);

  useEffect(() => {
    if (duration === undefined || duration === null) {
      return;
    }

    const id = setTimeout(() => {
      setStop(true);
    }, duration);

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [duration]);

  return (
    <ReactConfetti
      recycle={stop ? false : true}
      width={width}
      height={height}
    />
  );
}
