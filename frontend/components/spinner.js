import React from "react";

export function Spinner({ size = 20, color = "black" }) {
  const lines = Array(12).fill(null);

  return (
    <div
      className="spinner"
      style={{
        "--size": size + "px",
        "--color": color,
      }}
    >
      {lines.map((_, i) => {
        return (
          <div
            key={i}
            style={{
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${((i - 11) * 0.8) / 12}s`,
            }}
          />
        );
      })}

      <style jsx>{`
        .spinner {
          width: var(--size);
          height: var(--size);
          display: inline-block;
          position: relative;
        }

        .spinner div {
          transform-origin: center;
          position: absolute;
          width: var(--size);
          height: var(--size);
          animation: spinner 0.8s ease infinite;
        }
        .spinner div::after {
          content: " ";
          display: block;
          position: absolute;
          left: 50%;
          height: 6px;
          width: 2px;
          background: var(--color);
          transform: translateX(-50%);
        }

        @keyframes spinner {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
