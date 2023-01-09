import { useRouter } from "next/router";
import { Board } from "../board";
import { GameScreenLayout } from "../game-screen-layout";
import { MultiModeResult as GameResult } from "./result";
import { Hud } from "./hud";
import { useSocket } from "../../contexts/SocketContext";
import { Setup } from "./setup";
import { Disconnected } from "../disconnected";
import { BaseModal } from "../base-modal";
import { useState } from "react";
import { useMultiPlayerGame } from "./useMultiPlayerGame";

export function MultiPlayerGame({ room }) {
  const [playerLeft, setPlayerLeft] = useState(null);
  const socket = useSocket();

  const handlePlayerLeave = (player) => {
    setPlayerLeft(player);
  };

  const resetPlayerLeft = () => setPlayerLeft(null);

  const {
    state,
    emitStartGame,
    handleRestart,
    leaveRoom,
    handleItemClick,
    handleStartGame,
  } = useMultiPlayerGame(socket, room, handlePlayerLeave);

  const handleLeaveRoom = () => {
    const sure = confirm("are you sure");
    if (sure) {
      leaveRoom();
      router.push("/");
    }
  };

  const router = useRouter();

  return (
    <GameScreenLayout
      menu={
        state.startGame && (
          <div style={{ display: "flex", gap: 4 }}>
            <button className="btn btn-primary" onClick={handleLeaveRoom}>
              leave room
            </button>

            {process.env.NODE_ENV !== "production" && (
              <button className="btn" onClick={() => socket.emit("_gameover")}>
                game over
              </button>
            )}
          </div>
        )
      }
      footer={
        <Hud
          player={state.player}
          nextPlayer={state.nextPlayer}
          players={state.players}
          flippedPair={state.flippedPair}
        />
      }
    >
      {state.disconnected && <Disconnected />}

      {state.gameOver && (
        <GameResult
          players={state.players}
          player={state.player}
          onRestart={handleRestart}
        />
      )}

      {playerLeft !== null && (
        <BaseModal open={true}>
          <div className="player-left-modal">
            <h3>Player {playerLeft.no} left</h3>
            <p>Do you want to continue playing?</p>
            <div className="btns">
              <button className="btn btn-primary" onClick={resetPlayerLeft}>
                sure
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => router.push("/")}
              >
                nah
              </button>
            </div>
          </div>

          <style jsx>{`
            .player-left-modal {
              text-align: center;
            }
            .player-left-modal h3 {
              font-size: 22px;
              margin-bottom: 4px;
            }
            .player-left-modal p {
              margin-bottom: 25px;
            }
            .player-left-modal .btns {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
            }
          `}</style>
        </BaseModal>
      )}

      {state.settingUp && (
        <Setup
          players={state.players}
          player={state.player}
          roomInfo={state.roomInfo}
          roomNotFound={state.roomNotFound}
          loaded={state.loaded}
          startCountdown={state.startCountdown}
          onCountdownFinish={handleStartGame}
          onStart={emitStartGame}
        />
      )}
      {state.startGame && (
        <Board
          size={state.roomInfo.gridSize}
          theme={state.roomInfo.theme}
          items={state.boardItems}
          flipped={state.flippedPair}
          opened={state.opened}
          onItemClick={handleItemClick}
        />
      )}
    </GameScreenLayout>
  );
}
