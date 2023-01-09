import {useState,useEffect } from "react"
import { generateBoardItems } from "../../utils";
import { flipDelay, gameOverDelay } from "../../constants";
import { useTimer } from "../../hooks/useTimer";


export function useSinglePlayerGame(settings) {
    const [boardItems, setBoardItems] = useState([]);
    const [opened, setOpened] = useState([]);
    const [flippedPair, setFlippedPair] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [moves, setMoves] = useState(0);
  
    const timer = useTimer({ paused: false });
  
    useEffect(() => {
      if (settings) {
        const boardItems = generateBoardItems(settings.gridSize, settings.theme);
        setBoardItems(boardItems);
      }
    }, [settings]);
  
    function restart() {
      const items = generateBoardItems(settings.gridSize, settings.theme);
      setOpened([]);
      setFlippedPair([]);
      setMoves(0);
      setBoardItems(items);
      setGameOver(false);
      timer.restart();
    }
  
    const handleItemClick = (item) => {
      setMoves((moves) => moves + 1);
      const pair = [...flippedPair, item];
      setFlippedPair(pair);
    };
  
    useEffect(() => {
      if (flippedPair.length === 2) {
        setTimeout(() => {
          const [firstIndex, secondIndex] = flippedPair;
          const firstItem = boardItems[firstIndex];
          const secondItem = boardItems[secondIndex];
          if (firstItem === secondItem) {
            setOpened((opened) => [...opened, firstIndex, secondIndex]);
          }
          setFlippedPair([]);
        }, flipDelay);
      }
    }, [boardItems, flippedPair]);
  
    useEffect(() => {
      if (boardItems.length > 0 && opened.length === boardItems.length) {
        timer.stop();
        setTimeout(() => {
          setGameOver(true);
        }, gameOverDelay);
      }
  
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardItems.length, opened,]);
  
    const state = {
      boardItems,
      opened,
      flippedPair,
      gameOver,
      moves
    }
  
    return {
      state,
      handleItemClick,
      restart,
      timer
    }
  
  }