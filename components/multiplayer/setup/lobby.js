import { Spinner } from "../../spinner";
import { BiCheck } from "react-icons/bi";

export function Lobby({ room, players, player: currentPlayer }) {
  const renderPlayers = () => {
    const lastPlayerNo = players[players.length - 1]?.no ?? 0;

    const remainingPlayers = [];
    for (let i = 1; i <= room.roomSize - players.length; i++) {
      remainingPlayers.push({ no: i + lastPlayerNo });
    }

    return (
      <>
        {players.map((player) => (
          <Player
            player={player}
            no={player.no}
            key={`player-${player.id}`}
            currentPlayerId={currentPlayer.id}
          />
        ))}
        {remainingPlayers.map((player) => (
          <Player
            key={`player-${player.no}`}
            player={null}
            currentPlayerId={currentPlayer.id}
            no={player.no}
          />
        ))}
      </>
    );
  };

  return (
    <div className="lobby">
      <p className="heading">Waiting for players</p>
      <ul className="players">{renderPlayers()}</ul>

      <style jsx>{`
        .heading {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .players {
          display: grid;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}

function Player({ no, player, currentPlayerId }) {
  const joined = !!player;

  return (
    <li className="player">
      Player {no} {player?.id === currentPlayerId ? "(You)" : ""}
      {joined ? (
        <span className="player-status joined">
          <BiCheck />
        </span>
      ) : (
        <span className="player-status">
          <Spinner />
        </span>
      )}
      <style jsx>{`
        .player {
          display: flex;
          align-items: center;
        }

        .player span {
          margin-left: auto;
        }
        .player .joined {
          color: green;
          font-size: 25px;
        }
      `}</style>
    </li>
  );
}
