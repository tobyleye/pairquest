import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Board } from "../../components/board";
import { BoardLayout } from "../../components/board-layout";
import { MultiGameResult } from "../../components/multi/game-result";
import { Hud } from "../../components/multi/hud";
import { useSocket } from "../../contexts/SocketContext";
import { Setup } from "../../components/multi/setup";

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

  useEffect(() => {
    const onUpdatePlayers = (players) => {
      console.log("new player joined", { players });
      setPlayers(players);
    };

    const onJoinRoom = (player, roomInfo) => {
      if (player && roomInfo) {
        setPlayer(player);
        setRoomInfo(roomInfo);
      } else {
        setRoomNotFound(true);
      }
      setLoaded(true);
    };

    socket.emit("join_room", id, onJoinRoom);

    // events
    const onStartGame = ({ boardItems }) => {
      setStartCountdown(true);
      setBoardItems(boardItems);
    };

    const events = {
      update_players: onUpdatePlayers,
      start_game: onStartGame,
      next_player(player) {
        if (nextPlayer !== null) {
          setTimeout(() => {
            setNextPlayer(player);
          }, 600);
        } else {
          setNextPlayer(player);
        }
      },
      update_flipped_pairs(flippedPair, delay) {
        let timeout = delay ? 600 : 0;
        setTimeout(() => {
          setFlippedPair(flippedPair);
        }, timeout);
      },
      update_opened: setOpened,
      disconnect() {
        console.log("disconnect!");
        if (id === "public") {
          window.location.reload();
        }
      },
      player_leave(player) {
        console.log(`player ${player?.id} left`);
        // if (id === 'test') {
        //   window.location.reload()
        // }
      },
      game_over() {
        setGameOver(true);
      },
    };

    function registerEvents() {
      for (let event in events) {
        socket.on(event, events[event]);
      }
    }

    function removeEvents() {
      for (let event in events) {
        socket.off(event, events[event]);
      }
    }

    registerEvents();
    return () => {
      // leave room
      socket.emit("leave_room");
      // unbind events
      removeEvents();
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

  return (
    <BoardLayout
      menu={
        <div>
          <button className="btn" onClick={leaveRoom}>
            leave room
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
      {gameOver && <MultiGameResult players={players} player={player} />}

      {settingUp && (
        <Setup
          players={players}
          player={player}
          roomInfo={roomInfo}
          roomNotFound={roomNotFound}
          loaded={loaded}
          startCountdown={startCountdown}
          onStartGame={handleStartGame}
        />
      )}
      {startGame && (
        <Board
          size={roomInfo.gridSize}
          items={boardItems}
          flipped={flippedPair}
          opened={opened}
          onItemClick={handleItemClick}
        />
      )}
    </BoardLayout>
  );
}
