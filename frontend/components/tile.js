import cx from "clsx";

export function Tile({ children, flipped, opened, onClick, style, disabled }) {
  return (
    <div
      onClick={() => {
        if (!flipped && !opened && !disabled) onClick();
      }}
      style={style}
      className={cx(
        "tile",
        { "tile-flipped": flipped },
        { "tile-flipped tile-opened": opened }
      )}
    >
      <div className="front">{children}</div>
      <div className="back"></div>
      <style jsx>{`
        .tile {
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
          animation: in 0.16s ease;
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

        .tile-flipped .back {
          transform: rotateY(180deg);
        }

        .tile-flipped .front {
          transform: rotateY(0deg);
        }

        .tile-opened .front {
          background: var(--orange);
        }
      `}</style>
    </div>
  );
}
