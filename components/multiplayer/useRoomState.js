import { flipDelay, gameOverDelay } from "../../constants";
import { useEffect, useRef, useState } from "react";
import { useClientId } from "../../hooks/useClientId";

export function useRoomState(socket, roomId) {
  const [gameStatus, setGameStatus] = useState("setup");
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBoard, setShowBoard] = useState(false);
  const [settingUp, setSettingUp] = useState(true);
  const [boardItems, setBoardItems] = useState(false);
  const [flippedPair, setFlippedPair] = useState([]);
  const [opened, setOpened] = useState([]);
  const [nextPlayer, setNextPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [disconnectedPlayers, setDisconnectedPlayers] = useState([]);
  const [disconnected, setDisconnected] = useState(false);

  const clientId = useClientId();
  const tilesClicked = useRef(0);

  const resetTilesClicked = () => (tilesClicked.current = 0);

  useEffect(() => {
    if (!clientId) return;

    if (!room) {
      setLoading(true);
      socket.emit("join_room", roomId, clientId, (response) => {
        if (response) {
          const { room, players, player } = response;
          setRoom(room);
          setPlayers(players);
          setPlayer(player);
        }
        setLoading(false);
      });
    }

    return () => {
      if (room) {
        socket.emit("leave_room");
      }
    };
  }, [socket, roomId, room, clientId]);

  useEffect(() => {
    const handleDisconnect = () => {
      if (gameStatus === "setup") {
        setRoom(null);
      } else {
        setDisconnected(true);
      }
      socket.emit("leave_room");
    };
    socket.on("disconnect", handleDisconnect);
    return () => {
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket, gameStatus]);

  useEffect(() => {
    const handlePlayerLeft = (leavingPlayer) => {
      if (gameStatus === "setup") {
        if (leavingPlayer.id === player.id) {
          setRoom(null);
        }
      } else {
        setDisconnectedPlayers((players) => players.concat(leavingPlayer));
      }
    };
    socket.on("player_left", handlePlayerLeft);
    return () => {
      socket.off("player_left", handlePlayerLeft);
    };
  }, [socket, gameStatus, player]);

  useEffect(() => {
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
        setGameStatus("ended");
      }, gameOverDelay);
    };

    const onRestart = ({ boardItems, nextPlayer, players }) => {
      setBoardItems(boardItems);
      setNextPlayer(nextPlayer);
      setPlayers(players);
      setOpened([]);
      setFlippedPair([]);
    };

    const updatePlayers = (players) => {
      setPlayers(players);
    };

    const initGameState = ({ boardItems, nextPlayer }) => {
      setBoardItems(boardItems);
      setNextPlayer(nextPlayer);
    };

    socket.on("update_players", updatePlayers);
    socket.on("match_found", matchFound);
    socket.on("next_player", nextPlayer);
    socket.on("no_match", noMatch);
    socket.on("update_flipped_pair", updateFlippedPair);
    socket.on("game_over", gameOver);
    socket.on("restart", onRestart);
    socket.on("start_game", initGameState);

    return () => {
      socket.off("match_found", matchFound);
      socket.off("next_player", nextPlayer);
      socket.off("no_match", noMatch);
      socket.off("update_flipped_pair", updateFlippedPair);
      socket.off("game_over", gameOver);
      socket.off("restart", onRestart);
      socket.off("update_players", updatePlayers);
      socket.off("start_game", initGameState);
    };
  }, [socket]);

  const handleTileClick = (index) => {
    if (player.id !== nextPlayer) return;
    // prevent further clicks
    if (tilesClicked.current === 2) return;
    tilesClicked.current += 1;
    socket.emit("play", { index });
  };

  const handleRestart = () => {
    setGameOver(false);
    setGameStatus("playing");
  };

  const start = () => {
    setSettingUp(false);
    setGameStatus("playing");
    setShowBoard(true);
  };

  const state = {
    loading,
    room,
    players,
    player,
    boardItems,
    flippedPair,
    opened,
    gameOver,
    nextPlayer,
    showBoard,
    settingUp,
    gameStatus,
    disconnected,
    disconnectedPlayers,
  };

  return {
    state,
    setDisconnectedPlayers,
    handleTileClick,
    handleRestart,
    start,
  };
}
