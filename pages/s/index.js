import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Board } from "../../components/board";
import { generateBoardItems } from "../../utils";
import { Hud } from "../../components/single/hud";
import { GameScreenLayout } from "../../components/game-screen-layout";
import { SingleModeMenu } from "../../components/single/menu";
import { flipDelay, gameOverDelay } from "../../constants";
import { useSingleModeSettings } from "../../contexts/SingleModeSettings";
import { SingleModeResult as GameResult } from "../../components/single/result";
import { useTimer } from "../../hooks/useTimer";

export default function Single() {
  const router = useRouter();
  const [boardItems, setBoardItems] = useState([]);
  const [opened, setOpened] = useState([]);
  const [flippedPair, setFlippedPair] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);

  const timer = useTimer({ paused: false });

  const { settings } = useSingleModeSettings();

  useEffect(() => {
    if (settings) {
      const boardItems = generateBoardItems(settings.gridSize, settings.theme);
      setBoardItems(boardItems);
    } else {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [boardItems.length, opened]);

  if (!settings) {
    return null;
  }

  return (
    <GameScreenLayout
      menu={
        <SingleModeMenu
          pauseTimer={timer.stop}
          resumeTimer={timer.start}
          onRestart={restart}
        />
      }
      footer={<Hud time={timer.formattedTime} moves={moves} />}
    >
      <div style={{ height: "100%" }}>
        {gameOver && (
          <GameResult
            timeElapsed={timer.formattedTime}
            moves={moves}
            onRestart={restart}
          />
        )}
        <Board
          disabled={flippedPair.length === 2}
          size={settings.gridSize}
          items={boardItems}
          flipped={flippedPair}
          opened={opened}
          onItemClick={handleItemClick}
          theme={settings.theme}
          key={boardItems.toString()}
        />
      </div>
    </GameScreenLayout>
  );
}
