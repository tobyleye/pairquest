import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Board } from "../../components/board";
import { GameScreenLayout } from "../../components/game-screen-layout";
import { MultiModeResult as GameResult } from "../../components/multi/result";
import { Hud } from "../../components/multi/hud";
import { useSocket } from "../../contexts/SocketContext";
import { Setup } from "../../components/multi/setup";
import { Disconnected } from "../../components/disconnected";
import { flipDelay, gameOverDelay } from "../../constants";

const registerEvents = (socket, events) => {
  for (let event in events) {
    socket.on(event, events[event]);
  }
};

const removeEvents = (socket, events) => {
  for (let event in events) {
    socket.off(event, events[event]);
  }
};

export default function Page() {
  const socket = useSocket();
  const router = useRouter();
  const [roomNotFound, setRoomNotFound] = useState(false);
  const { id } = router.query;
  const [settingUp, setSettingUp] = useState(true);
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [startCountdown, setStartCountdown] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [boardItems, setBoardItems] = useState([]);
  const [flippedPair, setFlippedPair] = useState([]);
  const [opened, setOpened] = useState([]);
  const [nextPlayer, setNextPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [disconnected, setDisconnected] = useState(false);

  console.log("players --", players);

  useEffect(() => {
    const nextPlayerHandler = (player) => {
      if (nextPlayer !== null) {
        setTimeout(() => {
          setNextPlayer(player);
        }, 600);
      } else {
        setNextPlayer(player);
      }
    };
    socket.on("next_player", nextPlayerHandler);
    return () => {
      socket.off("next_player", nextPlayerHandler);
    };
  }, [id, socket, nextPlayer]);

  useEffect(() => {
    socket.emit("join_room", id, (player, roomInfo) => {
      if (player && roomInfo) {
        setPlayer(player);
        setRoomInfo(roomInfo);
      } else {
        setRoomNotFound(true);
      }
      setLoaded(true);
    });

    const events = {
      update_players: (players) => {
        setPlayers(players);
      },
      start_game: ({ boardItems }) => {
        setStartCountdown(true);
        setBoardItems(boardItems);
      },
      update_flipped_pairs: (flippedPair, delay) => {
        const timeout = delay ? flipDelay : 0;
        setTimeout(() => {
          setFlippedPair(flippedPair);
        }, timeout);
      },
      update_opened: (opened) => setOpened(opened),
      disconnect: () => {
        setDisconnected(true);
      },
      player_leave: (player) => {
        console.log(`player ${player?.id} left`);
      },
      game_over: () => {
        setTimeout(() => {
          setGameOver(true);
        }, gameOverDelay);
      },
    };

    registerEvents(socket, events);

    return () => {
      removeEvents(socket, events);
      socket.emit("leave_room");
    };
  }, [socket, id]);

  const handleItemClick = (index) => {
    if (player.id !== nextPlayer) {
      return;
    }
    socket.emit("play", { index });
  };

  const handleStartGame = () => {
    setSettingUp(false);
    setStartGame(true);
  };

  const leaveRoom = () => {
    const sure = confirm("are you sure");
    if (sure) {
      socket.emit("leave_room");
      router.push("/");
    }
  };

  const emitStartGame = () => {
    socket.emit("start");
  };

  const handleRestart = (gameState) => {
    const { boardItems, nextPlayer, players } = gameState;
    setBoardItems(boardItems);
    setNextPlayer(nextPlayer);
    setPlayers(players);
    setFlippedPair([]);
    setOpened([]);
    setGameOver(false);
  };

  return (
    <GameScreenLayout
      menu={
        startGame && (
          <div style={{ display: "flex", gap: 4 }}>
            <button className="btn btn-primary" onClick={leaveRoom}>
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
          player={player}
          nextPlayer={nextPlayer}
          players={players}
          flippedPair={flippedPair}
        />
      }
    >
      {disconnected && <Disconnected />}

      {gameOver && (
        <GameResult
          players={players}
          player={player}
          onRestart={handleRestart}
        />
      )}

      {settingUp && (
        <Setup
          players={players}
          player={player}
          roomInfo={roomInfo}
          roomNotFound={roomNotFound}
          loaded={loaded}
          startCountdown={startCountdown}
          onCountdownFinish={handleStartGame}
          onStartAnyway={emitStartGame}
        />
      )}
      {startGame && (
        <Board
          size={roomInfo.gridSize}
          theme={roomInfo.theme}
          items={boardItems}
          flipped={flippedPair}
          opened={opened}
          onItemClick={handleItemClick}
        />
      )}
    </GameScreenLayout>
  );
}
