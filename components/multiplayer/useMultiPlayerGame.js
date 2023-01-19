import { useEffect, useRef, useState } from "react";
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

export function useMultiPlayerGame(socket, room, onPlayerLeave) {
  const [roomNotFound, setRoomNotFound] = useState(false);
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
  const tilesClicked = useRef(0);

  const resetTilesClicked = () => (tilesClicked.current = 0);

  useEffect(() => {
    const nextPlayerHandler = (player) => {
      if (nextPlayer !== null) {
        setTimeout(() => {
          setNextPlayer(player);
          resetTilesClicked();
        }, 600);
      } else {
        setNextPlayer(player);
      }
    };
    socket.on("next_player", nextPlayerHandler);
    return () => {
      socket.off("next_player", nextPlayerHandler);
    };
  }, [room, socket, nextPlayer]);

  useEffect(() => {
    socket.emit("join_room", room, (player, roomInfo) => {
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
      update_opened: (opened) => {
        setOpened(opened);
        resetTilesClicked();
      },
      disconnect: () => {
        setDisconnected(true);
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
  }, [socket, room]);

  useEffect(() => {
    const player_leave = (player) => {
      if (startGame && !gameOver) {
        onPlayerLeave(player);
      }
    };
    socket.on("player_leave", player_leave);
    return () => {
      socket.off("player_leave", player_leave);
    };
  }, [socket, onPlayerLeave, startGame, gameOver]);

  // useEffect(() => {
  //   // reset tiles clicked for next play basically
  //   if (nextPlayer || flippedPair.length === 0) {
  //     tilesClicked.current = 0;
  //   }
  // }, [nextPlayer, flippedPair]);

  const handleTileClick = (index) => {
    if (player.id !== nextPlayer) {
      return;
    }
    // prevent further clicks
    if (tilesClicked.current === 2) {
      return;
    }

    tilesClicked.current += 1;
    socket.emit("play", { index });
  };

  const handleStartGame = () => {
    setSettingUp(false);
    setStartGame(true);
  };

  const leaveRoom = () => {
    socket.emit("leave_room");
  };

  const emitStartGame = () => {
    socket.emit("start");
  };

  const handleRestart = () => {
    setGameOver(false);
  };

  const setNewGameState = (gameState) => {
    const { boardItems, nextPlayer, players } = gameState;
    setBoardItems(boardItems);
    setNextPlayer(nextPlayer);
    setPlayers(players);
    setFlippedPair([]);
    setOpened([]);
  };

  return {
    state: {
      roomNotFound,
      settingUp,
      loaded,
      roomInfo,
      startCountdown,
      startGame,
      flippedPair,
      boardItems,
      opened,
      gameOver,
      disconnected,
      players,
      player,
      nextPlayer,
    },
    emitStartGame,
    handleRestart,
    leaveRoom,
    handleTileClick,
    handleStartGame,
    setNewGameState,
  };
}
