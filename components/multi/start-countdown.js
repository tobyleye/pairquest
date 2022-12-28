import { useState, useEffect } from "react";

export function StartCountdown({ onDone }) {
  const [secs, setSecs] = useState(3);
  useEffect(() => {
    let timeout;
    if (secs > 0) {
      timeout = setTimeout(() => {
        setSecs((secs) => secs - 1);
      }, 1000);
    } else {
      onDone();
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [secs, onDone]);

  return (
    <div className="countdown">
      <p>Starting game in </p>
      <p className="secs">{secs}</p>
      <style jsx>{`
        .countdown {
          text-align: center;
          color: var(--text-gray);
          margin: 20px 0;
        }

        .secs {
          font-size: 40px;
          color: var(--orange);
          margin-top: 8px;
          font-weight: bold;
          text-shadow: 2px 2px #b67307;
        }
      `}</style>
    </div>
  );
}
