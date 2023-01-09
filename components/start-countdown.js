import { useCountdown } from "../hooks/useCountdown";

export function StartCountdown({ onDone }) {
  const countdown = useCountdown({ seconds: 3, onDone: onDone });

  return (
    <div className="countdown">
      <p>Starting game in </p>
      <p className="secs">{countdown}</p>
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
