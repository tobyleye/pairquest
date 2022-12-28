import cx from "clsx";
import { icons } from "../constants";

export function Board({ size, items, onItemClick, flipped, opened, theme, disabled }) {
  return (
    <div className="board-container">
      <div
        className="board"
        style={{
          "--rows": size[0],
          "--cols": size[1],
        }}
      >
        {items.map((i, idx) => (
          <div key={idx}>
            <Card
              flipped={flipped.includes(idx)}
              opened={opened.includes(idx)}
              onClick={() => onItemClick(idx)}
              disabled={disabled}
              style={{
                '--animation-delay': `${idx * .01}s`,
              }}
            >
              {theme === "icons" ? <span>{icons[i]}</span> : i}
            </Card>
          </div>
        ))}
      </div>
      <style jsx>{`
        .board-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 10px;
        }
        .board {
          display: inline-grid;
          width: 100vw;
          height: 100vw;
          max-width: 400px;
          max-height: 400px;
          grid-template-columns: repeat(var(--cols), 1fr);
          grid-template-rows: repeat(var(--rows), 1fr);
          gap: 15px;
          font-size: 22px;
        }
      `}</style>
    </div>
  );
}

function Card({ children, flipped, opened, onClick, style, disabled }) {
  return (
    <div
      onClick={() => {
        if (!flipped && !opened && !disabled ) onClick();
      }}
      style={style}
      className={cx(
        "card",
        { "card-flipped": flipped },
        { "card-flipped card-opened": opened }
      )}
    >
      <div className="front">{children}</div>
      <div className="back"></div>
      <style jsx>{`
        .card {
          width: 100%;
          height: 100%;
          border-radius: 99px;
          display: grid;
          place-items: center;
          font-weight: 800;
          transition: 0.24s ease;
          color: white;
          position: relative;
          perspective: 250px;
          animation: in .16s ease;
          animation-delay: var(--animation-delay);
          animation-fill-mode: both;
        }

        @keyframes in {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .front,
        .back {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 99px;
          transition: 0.35s ease;
        }

        .back {
          background: var(--gray-2x-dark);
          backface-visibility: hidden;
        }

        .front {
          background: var(--gray-light);
          color: white;
          display: grid;
          place-items: center;
          transform: rotateY(-180deg);
        }

        .card-flipped .back {
          transform: rotateY(180deg);
        }

        .card-flipped .front {
          transform: rotateY(0deg);
        }

        .card-opened .front {
          background: var(--orange);
        }
      `}</style>
    </div>
  );
}
