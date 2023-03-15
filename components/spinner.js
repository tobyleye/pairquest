import React from "react";

export function Spinner({ size = 20, color = "black" }) {
  const lines = Array(8).fill(null);
  const eachLineAngle = 360 / lines.length;

  return (
    <div
      className="spinner"
      style={{
        "--size": `${size}px`,
        "--color": color,
      }}
    >
      {lines.map((_, i) => {
        return (
          <div
            key={i}
            style={{
              transform: `rotate(${i * eachLineAngle}deg)`,
              animationDelay: `${
                ((i - lines.length - 1) * 0.8) / lines.length
              }s`,
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
          /* border: 1px solid red; */
          animation: spinner 0.8s ease infinite;
        }
        .spinner div::after {
          content: " ";
          display: block;
          position: absolute;
          left: 50%;
          height: 34%;
          width: 2.4px;
          border-radius: 2px;
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
