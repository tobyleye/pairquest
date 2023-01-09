import { useEffect,  useState } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { StartCountdown } from "../start-countdown";
import { useRouter } from "next/router";
import { useCountdown } from "../../hooks/useCountdown";
import { GameResultModal, Header, Results } from "../game-result-modal";

export function MultiModeResult({ players, player, onRestart }) {
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
        let label = p.id === player.id ? `You` : `Player ${p.no}`;

        if (isWinner) {
          label += " (Winner)!";
        }

        results.push({
          label,
          value: `${p.score} Pairs`,
          winner: isWinner,
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

  const countdown = useCountdown({ seconds: 10 });

  return (
    <GameResultModal
      open={true}
      showConfetti={showConfetti && !showGameCountdown}
    >
      {showGameCountdown ? (
        <StartCountdown onDone={() => onRestart(newGameState)} />
      ) : (
        <div>
          <Header
            heading={heading}
            subHeading="Game over! Here are the results…"
          ></Header>

          <Results>
            {results.map((item, index) => {
              return (
                <Results.Item
                  fill={item.winner === true}
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              );
            })}
          </Results>

          <div className="game-result_btns game-result_btns-stack">
            <div style={{ display: countdown === 0 ? "none" : "block" }}>
              {player?.isHost ? (
                <button
                  disabled={restartLoading}
                  className="btn btn-secondary"
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
            <button
              className="btn btn-primary"
              onClick={() => router.push("/")}
            >
              New Game
            </button>
          </div>
        </div>
      )}
    </GameResultModal>
  );
}
