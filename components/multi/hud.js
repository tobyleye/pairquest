import clsx from "clsx";

export function Hud({ players, nextPlayer, player }) {
  return (
    <div>
      <div className="player-list">
        {players.map((p) => (
          <Player
            player={p}
            key={p.id}
            currentTurn={nextPlayer === p.id}
            you={player.id === p.id}
          />
        ))}
      </div>

      <style jsx>{`
        .player-list {
          display: flex;
          gap: 25px;
          align-items: flex-start;
          justify-content: center;
        }
        @media (min-width: 600px) {
          .player-list {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}

function Player({ player, you, currentTurn }) {
  return (
    <div>
      <div className={clsx("player", currentTurn && "active")}>
        <div>
          <div className="player-no player-no--desktop">
            Player {player.no} {you && <div className="player-you">(You)</div>}{" "}
          </div>
          <div className="player-no player-no--mobile">
            P{player.no}
            {you && <div className="player-you">(You)</div>}
          </div>
        </div>
        <div className="matched-pairs">{player.matchedPairs ?? "0"}</div>
      </div>

      {currentTurn && <div className="current-turn">current turn</div>}
      <style jsx>{`
        .player {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px 0px;
          height: 88px;
          width: 80px;
          border-radius: 5px;
          background: var(--subtle-gray);
        }

        .player.active {
          background: var(--orange);
          color: white;
        }

        .player.active::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0px;
          border: 1px solid red;
          transform: translate(-50%, -100%);
          border: 15px solid transparent;
          border-bottom: 15px solid var(--orange);
        }

        .player-you {
            font-size: 12px;
            margin-top: 2px;
        }

        .player-no {
          color: var(--text-gray);
          font-weight: 600;
        }

       

        .player-no--desktop {
          display: none;
        }

        .matched-pairs {
          font-weight: 700;
          font-size: 24px;
          color: var(--gray-dark);
          margin-top: auto;
        }

        .player.active .matched-pairs {
          color: white;
        }

        .player.active .player-no {
          color: white;
        }

        .current-turn {
          display: none;
          color: #152938;
          letter-spacing: 4px;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          text-transform: uppercase;
          margin-top: 5px;
        }

        @media (min-width: 600px) {
          .player {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            height: 66px;
            width: auto;
            text-align: left;
          }
          .matched-pairs {
            margin-left: 100px;
            margin-top: 0;
          }

          .player-no--desktop {
            display: block;
          }
          .player-no--mobile {
            display: none;
          }
          .current-turn {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
