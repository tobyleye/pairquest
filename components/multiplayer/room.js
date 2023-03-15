import { GameScreenLayout } from "../../components/game-screen-layout";
import { useSocket } from "../../contexts/SocketContext";
import { Board } from "../../components/board";
import { Hud } from "../../components/multiplayer/hud";
import { Setup } from "./setup/setup";
import { MultiplayerGameResult } from "../../components/multiplayer/result";
import { useRoomState } from "./useRoomState";
import { PlayerDisconnected } from "./player-disconnected";
import { Disconnected } from "./disconnected";
import { LeaveRoom } from "./leave-room";

export function Room({ roomId }) {
  const socket = useSocket();

  const {
    state,
    handleTileClick,
    handleRestart,
    start,
    setDisconnectedPlayers,
  } = useRoomState(socket, roomId);

  const {
    loading,
    players,
    player,
    nextPlayer,
    room,
    flippedPair,
    opened,
    boardItems,
    showBoard,
    settingUp,
    gameOver,
    gameStatus,
    disconnected,
    disconnectedPlayers,
  } = state;

  return (
    <GameScreenLayout
      footer={
        showBoard && (
          <Hud nextPlayer={nextPlayer} players={players} player={player} />
        )
      }
      menu={
        showBoard && (
          <div style={{ display: "flex", gap: 4 }}>
            <LeaveRoom players={players} />

            {process.env.NODE_ENV !== "production" && (
              <button className="btn" onClick={() => socket.emit("_gameover")}>
                game over
              </button>
            )}
          </div>
        )
      }
    >
      {settingUp === true && (
        <Setup
          loading={loading}
          room={room}
          players={players}
          player={player}
          onStart={start}
        />
      )}

      <PlayerDisconnected
        players={disconnectedPlayers}
        reset={() => setDisconnectedPlayers([])}
        gameStatus={gameStatus}
      />

      <Disconnected disconnected={disconnected} />

      {showBoard && (
        <Board
          size={room.gridSize}
          theme={room.theme}
          items={boardItems}
          flipped={flippedPair}
          opened={opened}
          onTileClick={handleTileClick}
        />
      )}

      {gameOver && (
        <MultiplayerGameResult
          player={player}
          players={players}
          onRestart={handleRestart}
        />
      )}
    </GameScreenLayout>
  );
}
