import { useRouter } from "next/router";
import { useEffect,  useState } from "react";
import { Board } from "../../components/board";
import { BoardLayout } from "../../components/board-layout";
import { MultiGameResult } from "../../components/multi/game-result";
import { Hud } from "../../components/multi/hud";
import { useSocket } from "../../contexts/SocketContext";
import { Setup } from "../../components/multi/setup";
import { Disconnected } from "../../components/disconnected";

const registerEvents = (socket, events) => {
  for (let event in events) {
    socket.on(event, events[event]);
  }
}

const removeEvents = (socket, events) => {
  for (let event in events) {
    socket.off(event, events[event]);
  }
}

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

  useEffect(() => {
    const nextPlayerHandler =(player) => {
      if (nextPlayer !== null) {
        setTimeout(() => {
          setNextPlayer(player);
        }, 600);
      } else {
        setNextPlayer(player);
      }
    }
    socket.on("next_player", nextPlayerHandler)
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
        console.log({ flippedPair });
        let timeout = delay ? 600 : 0;
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
        setGameOver(true);
      },
    };

    registerEvents(socket, events);

    return () => {
      removeEvents(socket, events);
      socket.emit("leave_room");
    };

  }, [socket, id]);

  const handleItemClick = (index) => {
    console.log("item clicked::", { index });
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
    const { boardItems, nextPlayer } = gameState;
    console.log("restart game state --", { boardItems, nextPlayer });
    setBoardItems(boardItems);
    setNextPlayer(nextPlayer);
    setFlippedPair([]);
    setOpened([]);
    setGameOver(false);
  };


  console.log('player --', player)
  
  return (
    <BoardLayout
      menu={
        <div style={{ display: "flex", gap: 4 }}>
          {startGame && (
            <button className="btn" onClick={leaveRoom}>
              leave room
            </button>
          )}
          <button className="btn" onClick={() => socket.emit("_gameover")}>
            game over
          </button>
        </div>
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
        <MultiGameResult
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
    </BoardLayout>
  );
}
