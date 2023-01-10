import { Board } from "../board";
import { Hud } from "./hud";
import { GameScreenLayout } from "../game-screen-layout";
import { SinglePlayerMenu } from "./menu";
import { SingleModeResult as GameResult } from "./result";
import { useSinglePlayerGame } from "./useSinglePlayerGame";

export function SinglePlayerGame({ settings, resetSettings }) {
  const { handleItemClick, restart, state, timer } =
    useSinglePlayerGame(settings);

  return (
    <GameScreenLayout
      menu={
        <SinglePlayerMenu
          pauseTimer={timer.stop}
          resumeTimer={timer.start}
          onRestart={restart}
          onNewGame={resetSettings}
        />
      }
      footer={<Hud time={timer.formattedTime} moves={state.moves} />}
    >
      <div style={{ height: "100%" }}>
        {state.gameOver && (
          <GameResult
            timeElapsed={timer.formattedTime}
            moves={state.moves}
            onRestart={restart}
            onNewGame={resetSettings}
          />
        )}
        <Board
          disabled={state.flippedPair.length === 2}
          size={settings.gridSize}
          items={state.boardItems}
          flipped={state.flippedPair}
          opened={state.opened}
          onItemClick={handleItemClick}
          theme={settings.theme}
          key={state.boardItems.toString()}
        />
      </div>
    </GameScreenLayout>
  );
}
