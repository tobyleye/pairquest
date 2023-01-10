import { useRouter } from "next/router";
import { GameResultModal, Results, Header } from "../game-result-modal";

export function SingleModeResult({ moves, timeElapsed, onRestart, onNewGame }) {
  const router = useRouter();
  return (
    <GameResultModal showConfetti>
      <Header
        heading="You did it"
        subHeading="Game over! Here’s how you got on…"
      />
      <Results>
        <Results.Item label="Time Elapsed" value={timeElapsed} />
        <Results.Item label="Moves Taken" value={`${moves} Moves`} />
      </Results>
      <div className="game-result_btns">
        <button className="btn btn-primary" onClick={onRestart}>
          Restart
        </button>
        <button className="btn btn-secondary" onClick={onNewGame}>
          New Game
        </button>
      </div>
    </GameResultModal>
  );
}
