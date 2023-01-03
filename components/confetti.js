import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";

export function Confetti({ width, height, timeout=4000, numberOfPieces=200 }) {
  const [stop, setStop] = useState(false);

  useEffect(() => {
    if (timeout === undefined || timeout === null) {
      return;
    }

    const id = setTimeout(() => {
      setStop(true);
    }, timeout);

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [timeout]);

  return (
    <ReactConfetti
      recycle={stop ? false : true}
      width={width}
      height={height}
      style={{
        zIndex: 20000
      }}
      numberOfPieces={numberOfPieces}
    />
  );
}
