export function Hud({ time, moves}) {
  return (
    <div className="hud">
      <div className="hud-info time">
        Time
        <span>{time}</span>
      </div>

      <div className="hud-info moves">
        Moves
        <span>{moves}</span>
      </div>

      <style jsx>{`
        .hud {
          display: flex;
          gap: 10px;
          max-width: 400px;
          margin: auto;
        }

        .hud > * {
          flex: 1;
        }
        .hud-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          color: var(--text-gray);
          font-weight: bold;
          background: var(--subtle-gray);
          border-radius: 8px;
          padding: 14px 14px;
        }

        .hud-info span {
          color: var(--gray-dark);
          font-size: 20px;
        }

        @media (min-width: 640px) {
          .hud-info {
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
