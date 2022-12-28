import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Board } from "../../components/board";
import { GameResult } from "../../components/game-result";
import { useTimer } from "../../hooks";
import { parseGridSize, generateBoardItems } from "../../utils";
import { Hud } from "../../components/single/hud";
import { BoardLayout } from "../../components/board-layout";
import { BoardMenu } from "../../components/single/menu";
import { flipDelay } from "../../constants";

export default function Single() {
  const router = useRouter();
  const { gridSize, theme: _theme } = router.query;
  const [boardItems, setBoardItems] = useState([]);
  const [size, setSize] = useState([]);
  const [opened, setOpened] = useState([]);
  const [flippedPair, setFlippedPair] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [theme, setTheme] = useState();
  const timer = useTimer({ paused: false });

  useEffect(() => {
    const size = parseGridSize(gridSize);
    const boardItems = generateBoardItems(size, _theme);
    setSize(size);
    setBoardItems(boardItems);
    setTheme(_theme);
  }, [gridSize, _theme]);

  function restart() {
    const items = generateBoardItems(size, _theme);
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
        // wait one sec
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardItems.length, opened]);

  return (
    <BoardLayout
      menu={
        <BoardMenu
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
            showConfetti
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
          // wait until the flipped pair is turned before allowing clicks
          disabled={flippedPair.length === 2}
          size={size}
          items={boardItems}
          flipped={flippedPair}
          opened={opened}
          onItemClick={handleItemClick}
          theme={theme}
          key={boardItems.toString()}
        />
      </div>
    </BoardLayout>
  );
}
