import cx from "clsx";

export function Tile({ children, flipped, opened, onClick, style, disabled }) {
  return (
    <div className="tile-wrapper" style={style}>
      <div
        onClick={() => {
          if (!flipped && !opened && !disabled) onClick();
        }}
        className={cx(
          "tile",
          { "tile-flipped": flipped },
          { "tile-flipped tile-opened": opened }
        )}
      >
        <div className="back"></div>
        <div className="front">{children}</div>
      </div>
      <style jsx>{`
        .tile-wrapper {
          perspective: 300px;
          height: 100%;
          width: 100%;
          animation: in 0.16s ease;
          animation-delay: var(--animation-delay);
          animation-fill-mode: both;
        }

        .tile {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: 0.3s ease;
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
          backface-visibility: hidden;
          transition: 0.25s ease;
        }

        .front {
          display: grid;
          place-items: center;
          font-weight: 800;
          transform: rotateY(180deg);
          background: var(--gray-light);
          color: white;
        }

        .back {
          background: var(--gray-2x-dark);
        }

        .tile-flipped {
          transform: rotateY(180deg);
        }

        .tile-opened .front {
          background: var(--orange);
        }
      `}</style>
    </div>
  );
}
