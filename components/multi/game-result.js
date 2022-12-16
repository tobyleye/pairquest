import { BaseModal } from "../base-modal";

export function GameResult({ players, player }) {
  return (
    <BaseModal open={true}>
        <p>Game over! Here are the results…</p>
      <div>
        {players.map((player) => {
          return (
            <div key={player.id}>
              <div>{player.no}</div>
              <div>{player.matchedPairs}</div>
            </div>
          );
        })}
      </div>
    </BaseModal>
  );
}
