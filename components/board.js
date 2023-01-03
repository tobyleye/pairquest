import { icons } from "../constants";
import { Tile } from "./tile"


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
            <Tile
              flipped={flipped.includes(idx)}
              opened={opened.includes(idx)}
              onClick={() => onItemClick(idx)}
              disabled={disabled}
              style={{
                '--animation-delay': `${idx * .01}s`,
              }}
            >
              {theme === "icons" ? <span>{icons[i]}</span> : i}
            </Tile>
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
