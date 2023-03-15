import clsx from "clsx";
import { icons } from "../constants";
import { Tile } from "./tile";

export function Board({
  size,
  items,
  onTileClick,
  flipped,
  opened,
  theme,
  disabled,
}) {
  let sizeStr = size.join("x");

  return (
    <div className="board-container">
      <div
        className={clsx(
          "board",
          { "6x6": "six-by-six", "4x4": "four-by-four" }[sizeStr]
        )}
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
              onClick={() => onTileClick(idx)}
              disabled={disabled}
              style={{
                "--animation-delay": `${idx * 0.01}s`,
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
          --size: calc(min(100vw, 620px) - 20px);
          display: inline-grid;
          width: var(--size);
          height: var(--size);
          grid-template-columns: repeat(var(--cols), 1fr);
          grid-template-rows: repeat(var(--rows), 1fr);
          gap: 15px;
          font-size: 18px;
        }

        .board.four-by-four {
          font-size: 25px;
        }

        .board.six-by-six {
          gap: 8px;
          font-size: 18px;
        }

        @media (min-width: 560px) {
          .board.four-by-four {
            font-size: 30px;
          }

          .board.six-by-six {
            gap: 16px;
            font-size: 25px;
          }
        }
      `}</style>
    </div>
  );
}
