import { GameScreenLayout } from "../../components/game-screen-layout";
import { useSocket } from "../../contexts/SocketContext";
import { Board } from "../../components/board";
import { Hud } from "../../components/multiplayer/hud";
import { Setup } from "../../components/multiplayer/setup";
import { MultiplayerGameResult } from "../../components/multiplayer/result";
import { useRoomState } from "./useRoomState";
import { PlayerDisconnected } from "./player-disconnected";
import { useRouter } from "next/router";

export function Room({ roomId }) {
  const socket = useSocket();
  const { state, countdownEnd, handleTileClick, start, handleRestart } =
    useRoomState(socket, roomId);

  const {
    players,
    player,
    nextPlayer,
    room,
    loading,
    startCountdown,
    flippedPair,
    opened,
    boardItems,
    showBoard,
    settingUp,
    gameOver,
  } = state;

  const router = useRouter();

  const handleLeaveRoom = () => {
    const sure = confirm("are you sure");
    if (sure) {
      socket.emit("leave_room");
      router.push("/");
    }
  };

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
    >
      {settingUp === true && (
        <Setup
          loading={loading}
          room={room}
          player={player}
          players={players}
          startCountdown={startCountdown}
          onCountdownFinish={countdownEnd}
          onStart={start}
        />
      )}

      <PlayerDisconnected
        socket={socket}
        player={player}
        gameOver={gameOver}
        gameStarted={showBoard === true}
      />

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
