import { GameResult } from "../game-result";

export function MultiGameResult({ players, player }) {

  const getWinners = () => {
    let winners = {}; // id: player
    let highestMatchedPairs = 0;
    for (let p of players) {
      if (p.matchedPairs > highestMatchedPairs) {
        // we a new player with highest matched pairs 
        // so we reset winners 
        winners = {}
        winners[p.id] = p;
        highestMatchedPairs = p.matchedPairs;
      } else if (p.matchedPairs === highestMatchedPairs) {
        winners[p.id] = p
      }
    }
    return winners;
  };

  const getResultHeading = (winners) => {
    winners = Object.values(winners);
    if (winners.length === 1) {
      let winner = winners[0];
      return `Player ${winner.no} Wins!`;
    } else {
      return `It's a tie!`;
    }
  };

  const getResult = (winners) => {
    // sort players by matchedPairs
    let sortedPlayers = players.sort((p1, p2) => {
      if (p1.matchedPairs === p2.matchedPairs) return 0;
      if (p2.matchedPairs > p1.matchedPairs) {
        return 1;
      } else {
        return -1;
      }
    });

    let results = [];

    for (let p of sortedPlayers) {
      let isWinner = winners[p.id] !== undefined;
      let label;
      if (isWinner) {
        label = `Player ${p.no} (Winner)!`;
      } else {
        label = `Player ${p.no}`;
      }
      results.push({
        label,
        value: p.matchedPairs,
      });
    }

    return results;
  };

  const winners = getWinners();
  const heading = getResultHeading(winners);
  const results = getResult(winners);
  

  const showConfetti = winners[player.id] !== undefined

  return (
    <GameResult
      showConfetti={showConfetti}
      heading={heading}
      subheading="Game over! Here are the results…"
      results={results}
    />
  );
}
