import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Board } from "../../components/board";
import { GameResult } from "../../components/single/game-result";
import { useTimer } from "../../hooks";
import { BoardHeader } from "../../components/single/header";
import { parseGridSize, generateBoardItems } from "../../utils";
import { Hud } from "../../components/single/hud";
import { BoardLayout } from "../../components/board-layout";

export default function Single() {
  const router = useRouter();
  const { gridSize, theme } = router.query;
  const [boardItems, setBoardItems] = useState([]);
  const [size, setSize] = useState([]);
  const [opened, setOpened] = useState([]);
  const [flippedPair, setFlippedPair] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);

  const timer = useTimer({ paused: false });

  useEffect(() => {
    const size = parseGridSize(gridSize);
    const boardItems = generateBoardItems(size, theme);
    setSize(size);
    setBoardItems(boardItems);
  }, [gridSize, theme]);

  function restart() {
    const items = generateBoardItems(size);
    setOpened([]);
    setFlippedPair([]);
    setMoves(0);
    setBoardItems(items);
    setGameOver(false);
    timer.restart();
  }

  const handleItemClick = (index) => {
    setMoves((moves) => moves + 1);
    const pair = [...flippedPair, index];
    setFlippedPair(pair);
  };

  useEffect(() => {
    if (flippedPair.length === 2) {
      setTimeout(() => {
        let [firstIndex, secondIndex] = flippedPair;
        const firstItem = boardItems[firstIndex];
        const secondItem = boardItems[secondIndex];
        if (firstItem === secondItem) {
          setOpened([...opened, firstIndex, secondIndex]);
        }
        setFlippedPair([]);
      }, 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedPair]);

  useEffect(() => {
    if (boardItems.length > 0 && opened.length === boardItems.length) {
      timer.pause();
      setGameOver(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <BoardLayout
      header={
        <BoardHeader
          pauseTimer={timer.pause}
          resumeTimer={timer.resume}
          onRestart={restart}
        />
      }
      footer={<Hud time={timer.formattedTime} moves={moves} />}
    >
      <div style={{ height: '100%'}}>
        {gameOver && (
          <GameResult
            heading="You did it"
            subheading="Game over! Here’s how you got on…"
            results={[
              { label: "Time Elapsed", value: timer.formattedTime },
              { label: "Moves Taken", value: `${moves} Moves` },
            ]}
            onRestart={restart}
          />
        )}

        <Board
          size={size}
          items={boardItems}
          flipped={flippedPair}
          opened={opened}
          onItemClick={handleItemClick}
        />
      </div>
    </BoardLayout>
  );
}
