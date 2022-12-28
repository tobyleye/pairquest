import { useEffect, useRef, useState } from "react";
import { BaseModal } from "../base-modal";
import { Confetti } from "../confetti";
import { useSocket } from "../../contexts/SocketContext";
import { StartCountdown } from "./start-countdown";
import clsx from "clsx";
import { useRouter } from "next/router";

export function MultiGameResult({ players, player, onRestart }) {
  const [heading, setHeading] = useState("");
  const [results, setResults] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameCountdown, setShowGameCountdown] = useState(false);
  const [newGameState, setNewGameState] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getWinners = () => {
      let winners = {}; // Record<id, player>
      let highestScore = 0;
      for (let p of players) {
        if (p.score > highestScore) {
          winners = {};
          winners[p.id] = p;
          highestScore = p.score;
        } else if (p.score === highestScore && highestScore !== 0) {
          winners[p.id] = p;
        }
      }
      return winners;
    };

    const getResultHeading = (winners) => {
      winners = Object.values(winners);
      if (winners.length === 1) {
        let winner = winners[0];
        return `Player ${winner.no} Wins!`;
      } else {
        return `It's a tie!`;
      }
    };

    const getResult = (winners) => {
      // sort players by score
      let sortedPlayers = players.sort((p1, p2) => {
        if (p1.score === p2.score) return 0;
        if (p2.score > p1.score) {
          return 1;
        } else {
          return -1;
        }
      });

      let results = [];

      for (let p of sortedPlayers) {
        let isWinner = winners[p.id] !== undefined;
        let label;
        if (isWinner) {
          label = `Player ${p.no} (Winner)!`;
        } else {
          label = `Player ${p.no}`;
        }
        results.push({
          label,
          value: `${p.score} Pairs`,
          highlight: isWinner,
        });
      }

      return results;
    };

    const winners = getWinners();
    const heading = getResultHeading(winners);
    const results = getResult(winners);
    const showConfetti = player && winners[player.id] !== undefined;

    setHeading(heading);
    setResults(results);
    setShowConfetti(showConfetti);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const socket = useSocket();

  useEffect(() => {
    const handleRestart = (gameState) => {
      setNewGameState(gameState);
      setShowGameCountdown(true);
    };
    socket.on("restart", handleRestart);

    return () => {
      socket.off("restart", handleRestart);
    };
  }, [socket]);

  const [restartLoading, setRestartLoading] = useState(false);

  const emitRestart = () => {
    setRestartLoading(true);
    socket.emit("restart");
  };

  const modalRef = useRef();

  const countdown = useCountdown({ seconds, start: true });

  return (
    <BaseModal open={true} ref={modalRef}>
      {showGameCountdown ? (
        <StartCountdown onDone={() => onRestart(newGameState)} />
      ) : (
        <div className="game-result">
          {showConfetti && (
            <Confetti
              width={modalRef?.current?.clientWidth}
              height={modalRef?.current?.clientHeight}
              duration={9000}
            />
          )}
          <header className="game-result-header">
            <h3 className="game-result-heading">{heading}</h3>
            <p className="game-result-sub-heading">
              Game over! Here are the results…
            </p>
          </header>
          <div className="results">
            {results.map((item, index) => {
              return (
                <div
                  key={index}
                  className={clsx("result-item", item.highlight && "winner")}
                >
                  {item.label}
                  <span>{item.value}</span>
                </div>
              );
            })}
          </div>
          <div className="game-result-btns">
            <div style={{ display: countdown === 0 ? "none" : "block" }}>
              {player.isHost ? (
                <button
                  disabled={restartLoading}
                  className="btn btn-orange"
                  onClick={emitRestart}
                >
                  {restartLoading ? `Loading...` : ` Restart (${countdown})`}
                </button>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <p>Waiting for host... {countdown}</p>
                </div>
              )}
            </div>
            <button className="btn" onClick={() => router.push("/")}>
              New Game
            </button>
          </div>
        </div>
      )}
    </BaseModal>
  );
}

function useCountdown({ seconds, start = false }) {
  const [countdown, setCountdown] = useState(seconds);
  useEffect(() => {
    let id;
    if (countdown > 0) {
      id = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      id && clearTimeout(id);
    };
  }, [countdown]);

  return start ? countdown : undefined;
}
