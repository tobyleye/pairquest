import { flipDelay, gameOverDelay } from "../../constants";
import { useEffect, useRef, useState } from "react";

export function useRoomState(socket, roomId) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState(null);

  const [startCountdown, setStartCountdown] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [settingUp, setSettingUp] = useState(true);

  const [boardItems, setBoardItems] = useState(false);
  const [flippedPair, setFlippedPair] = useState([]);
  const [opened, setOpened] = useState([]);
  const [nextPlayer, setNextPlayer] = useState(null);

  const [gameOver, setGameOver] = useState(false);

  const joinStatusRef = useRef(null);

  const tilesClicked = useRef(0);

  const resetTilesClicked = () => (tilesClicked.current = 0);

  useEffect(() => {
    if (!["loading", "joined"].includes(joinStatusRef.current)) {
      joinStatusRef.current = "loading";
      socket.emit("join_room", roomId, (response) => {
        if (response) {
          joinStatusRef.current = "joined";
          const { room, players, player } = response;
          setRoom(room);
          setPlayers(players);
          setPlayer(player);
        }
        setLoading(false);
      });
    }

    return () => {
      if (joinStatusRef.current === "joined") {
        socket.emit("leave_room", roomId);
        joinStatusRef.current = null;
      }
    };
  }, [socket, roomId]);

  useEffect(() => {
    const updatePlayers = (players) => setPlayers(players);
    const handleStart = ({ boardItems, nextPlayer }) => {
      setFlippedPair([]);
      setOpened([]);
      setBoardItems(boardItems);
      setNextPlayer(nextPlayer);
      setStartCountdown(true);
    };

    const nextPlayer = (nextPlayer) => {
      setNextPlayer(nextPlayer);
    };

    const matchFound = ({ opened, players }) => {
      resetTilesClicked();
      setOpened(opened);
      setFlippedPair([]);
      setPlayers(players);
    };

    const noMatch = ({ nextPlayer }) => {
      setTimeout(() => {
        resetTilesClicked();
        setFlippedPair([]);
        setNextPlayer(nextPlayer);
      }, flipDelay);
    };

    const updateFlippedPair = (flippedPair) => {
      setFlippedPair(flippedPair);
    };

    const gameOver = () => {
      setTimeout(() => {
        setGameOver(true);
      }, gameOverDelay);
    };

    const onRestart = ({ boardItems, nextPlayer, players }) => {
      setBoardItems(boardItems);
      setNextPlayer(nextPlayer);
      setPlayers(players);
      setOpened([]);
      setFlippedPair([]);
    };

    const onDisconnect = () => {
      socket.emit("leave_room");
    };

    socket.on("update_players", updatePlayers);
    socket.on("start_game", handleStart);
    socket.on("match_found", matchFound);
    socket.on("next_player", nextPlayer);
    socket.on("no_match", noMatch);
    socket.on("update_flipped_pair", updateFlippedPair);
    socket.on("game_over", gameOver);
    socket.on("restart", onRestart);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.on("update_players", updatePlayers);
      socket.on("start_game", handleStart);
      socket.on("match_found", matchFound);
      socket.on("next_player", nextPlayer);
      socket.on("no_match", noMatch);
      socket.on("update_flipped_pair", updateFlippedPair);
      socket.on("game_over", gameOver);
      socket.on("restart", onRestart);
      socket.on("disconnect", onDisconnect);
    };
  }, [socket]);

  const countdownEnd = () => {
    setSettingUp(false);
    setShowBoard(true);
  };

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

  const start = () => {
    socket.emit("start");
  };

  const handleRestart = () => {
    setGameOver(false);
  };

  const state = {
    room,
    loading,
    players,
    player,
    boardItems,
    flippedPair,
    opened,
    gameOver,
    nextPlayer,
    startCountdown,
    showBoard,
    settingUp,
  };

  return {
    state,
    countdownEnd,
    handleTileClick,
    start,
    handleRestart,
  };
}
