import cx from "clsx";

export function Board({ size, items, onItemClick, flipped, opened }) {

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
            >
              {i}
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
        }
      `}</style>
    </div>
  );
}

function Card({ children, flipped, opened, onClick }) {
  return (
    <div
      onClick={() => {
        if (!flipped && !opened) onClick();
      }}
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
