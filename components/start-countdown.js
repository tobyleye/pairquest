import { useCountdown } from "../hooks/useCountdown";

export function StartCountdown({ onEnd }) {
  const countdown = useCountdown({ seconds: 3, onDone: onEnd });

  return (
    <div className="countdown">
      <p>Starting game in </p>
      <p className="secs" key={countdown}>
        {countdown}
      </p>
      <style jsx>{`
        .countdown {
          text-align: center;
          color: var(--text-gray);
          margin: 20px 0;
        }

        .secs {
          font-size: 45px;
          color: var(--orange);
          margin-top: 8px;
          font-weight: bold;
          text-shadow: 2px 2px #b67307;
          animation: shrink 1s ease;
        }

        @keyframes shrink {
          0% {
            transform: scale(1.5);
          }

          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
