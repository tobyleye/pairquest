import { useRouter } from "next/router";
import { useState } from "react";
import { RadioButtons } from "./radio-buttons";
import { useSocket } from "../contexts/SocketContext";
import { ShamelessPlug } from "./shameless-plug";
import { useClientId } from "../hooks/useClientId";
// import { HowToPlay } from "./how-to-play";

const defaultState = {
  theme: "numbers",
  numOfPlayers: "1",
  gridSize: "4x4",
};

const parseGridSize = (size) => {
  return size.split("x").map((s) => Number(s));
};

export function GameSettings({ setSettings }) {
  const [theme, setTheme] = useState(defaultState.theme);
  const [numOfPlayers, setNumOfPlayers] = useState(defaultState.numOfPlayers);
  const [gridSize, setGridSize] = useState(defaultState.gridSize);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  const clientId = useClientId();

  const startGame = () => {
    let players = Number(numOfPlayers);

    if (players === 1) {
      setSettings({
        gridSize: parseGridSize(gridSize),
        theme,
      });
    } else {
      if (!socket.connected) {
        alert(
          "Connection to the server failed, Sorry :(\nTry the single player mode."
        );
        return;
      }
      setLoading(true);
      const config = {
        theme,
        numOfPlayers: parseInt(numOfPlayers),
        gridSize: parseGridSize(gridSize),
        hostClientId: clientId,
      };
      socket.emit("create_room", config, (room) => {
        setLoading(false);
        router.push(`/play/${room}`);
      });
    }
  };

  return (
    <div className="game-settings">
      <div className="container">
        <header className="header">
          <h1>Pair Quest</h1>
          {/* <HowToPlay /> */}
        </header>

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
              name="numOfPlayers"
              options={["1", "2", "3", "4"].map((i) => ({
                label: i,
                value: i,
              }))}
              value={numOfPlayers}
              onChange={setNumOfPlayers}
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
        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        h1 {
          font-size: 30px;
          color: white;
          margin-bottom: 8px;
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
