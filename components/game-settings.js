import { useRouter } from "next/router";
import { useState } from "react";
import { RadioButtons } from "./radio-buttons";
import { useSocket } from "../contexts/SocketContext";
import { ShamelessPlug } from "./shameless-plug";

const defaultState = {
  theme: "numbers",
  totalPlayers: "1",
  gridSize: "4x4",
};

const parseGridSize = (size) => {
  return size.split("x").map((s) => Number(s));
};

export function GameSettings({ setSettings }) {
  const [theme, setTheme] = useState(defaultState.theme);
  const [totalPlayers, setTotalPlayers] = useState(defaultState.totalPlayers);
  const [gridSize, setGridSize] = useState(defaultState.gridSize);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const socket = useSocket();

  const startGame = () => {
    let players = Number(totalPlayers);

    if (players === 1) {
      setSettings({
        gridSize: parseGridSize(gridSize),
        theme,
      });
    } else {
      setLoading(true);
      const args = {
        noOfPlayers: parseInt(totalPlayers),
        theme,
        gridSize: parseGridSize(gridSize),
      };
      socket.emit("create_room", args, (room) => {
        setLoading(false);
        router.push(`/m/${room}`);
      });
    }
  };

  return (
    <div className="game-settings">
      <div className="container">
        <h1>Pair Quest</h1>
        <div className="form-container">
          <div className="form-elements">
            <RadioButtons
              label="Select Theme"
              name="theme"
              options={[
                { label: "numbers", value: "numbers" },
                { label: "icons", value: "icons" },
              ]}
              value={theme}
              onChange={setTheme}
            />

            <RadioButtons
              label="Number of players"
              name="totalPlayers"
              options={["1", "2", "3", "4"].map((i) => ({
                label: i,
                value: i,
              }))}
              value={totalPlayers}
              onChange={setTotalPlayers}
            />

            <RadioButtons
              label="Grid size"
              name="gridSize"
              options={[
                { label: "4x4", value: "4x4" },
                { label: "6x6", value: "6x6" },
              ]}
              value={gridSize}
              onChange={setGridSize}
            />

            <button
              disabled={loading}
              className="btn btn-primary start-btn"
              onClick={startGame}
            >
              {loading ? <Dots /> : `Start Game`}
            </button>
          </div>
        </div>

        <ShamelessPlug />
      </div>
      <style jsx>{`
        .game-settings {
          background: var(--gray-2x-dark);
          min-height: 100vh;
          padding: 0 16px;
          padding-top: 14vh;
        }
        .container {
          max-width: 480px;
          margin: auto;
        }
        h1 {
          font-size: 30px;
          margin-bottom: 27px;
          text-align: center;
          color: white;
        }

        .form-container {
          background: white;
          padding: 40px;
          border-radius: 10px;
        }

        .form-elements {
          display: grid;
          gap: 25px;
        }

        .start-btn {
          font-size: 20px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

function Dots() {
  return (
    <div className="dots">
      <span></span>
      <span></span>
      <span></span>
      <style jsx>{`
        .dots {
          display: flex;
          justify-content: center;
          gap: 4px;
        }
        .dots span {
          width: 6px;
          height: 6px;
          border-radius: 99px;
          background: white;
        }
      `}</style>
    </div>
  );
}
