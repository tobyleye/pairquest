import { useState, useEffect } from "react";
import { generateBoardItems } from "../../utils";
import { flipDelay, gameOverDelay } from "../../constants";
import { useTimer } from "../../hooks/useTimer";

export function useSinglePlayerGame(settings) {
  const [boardItems, setBoardItems] = useState(() =>
    generateBoardItems(settings.gridSize, settings.theme)
  );
  const [opened, setOpened] = useState([]);
  const [flippedPair, setFlippedPair] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);

  const timer = useTimer();

  function restart() {
    const items = generateBoardItems(settings.gridSize, settings.theme);
    setOpened([]);
    setFlippedPair([]);
    setMoves(0);
    setBoardItems(items);
    setGameOver(false);
    timer.restart();
  }

  const handleItemClick = (index) => {
    if (flippedPair.length === 2) return;
    const pair = [...flippedPair, index];
    setFlippedPair(pair);
    setMoves((moves) => moves + 1);
  };

  useEffect(() => {
    const checkFlipped = () => {
      if (flippedPair.length === 2) {
        setTimeout(() => {
          const [i, j] = flippedPair;
          const firstPair = boardItems[i];
          const secondPair = boardItems[j];
          if (firstPair === secondPair) {
            setOpened((opened) => [...opened, i, j]);
          }
          setFlippedPair([]);
        }, flipDelay);
      }
    };
    checkFlipped();
  }, [boardItems, flippedPair]);

  useEffect(() => {
    const checkGameOver = () => {
      if (boardItems.length > 0 && opened.length === boardItems.length) {
        timer.stop();
        setTimeout(() => {
          setGameOver(true);
        }, gameOverDelay);
      }
    };

    checkGameOver();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardItems.length, opened]);

  const state = {
    boardItems,
    opened,
    flippedPair,
    gameOver,
    moves,
  };

  return {
    state,
    handleItemClick,
    restart,
    timer,
  };
}
