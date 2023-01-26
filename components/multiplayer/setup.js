import Link from "next/link";
import { BaseModal } from "../base-modal";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Spinner } from "../spinner";
import { BiCheck } from "react-icons/bi";
import { StartCountdown } from "../start-countdown";

export function Setup({
  loading,
  room,
  players,
  player,
  startCountdown,
  onCountdownFinish,
  onStart,
}) {
  const roomNotFound = loading === false && room === null;

  return (
    <BaseModal open={true} disableCloseOnOverlayClick>
      <div>
        {loading ? (
          <div className="loading">
            <Spinner size={28} />
          </div>
        ) : roomNotFound ? (
          <div className="not-found">
            <div className="icon">😞</div>
            <p className="text">{`Room not found!`}</p>
            <Link href="/">
              <button className="btn btn-primary">setup new game</button>
            </Link>
          </div>
        ) : startCountdown ? (
          <StartCountdown onEnd={onCountdownFinish} />
        ) : (
          <div>
            <Lobby room={room} players={players} player={player} />
            {room.roomSize > 2 &&
            players.length > 1 &&
            player.isHost === true ? (
              <div className="start-block">
                <button
                  onClick={onStart}
                  className="btn btn-primary btn-inline start-btn"
                >
                  Start anyway
                </button>
              </div>
            ) : null}

            {player.isHost === true && <Share />}
          </div>
        )}
      </div>
      <style jsx>{`
        .loading {
          text-align: center;
          padding: 20px 0;
        }
        .not-found {
          text-align: center;
        }

        .not-found .icon {
          font-size: 50px;
          margin-bottom: 8px;
        }

        .not-found .text {
          font-size: 18px;
          color: var(--gray-dark);
          margin-bottom: 14px;
          font-weight: 400;
        }

        .start-block {
          display: flex;
          justify-content: center;
          margin-bottom: 14px;
          margin-top: 20px;
        }
        .start-btn {
          padding: 0px 40px;
          height: 38px;
        }
      `}</style>
    </BaseModal>
  );
}

function Lobby({ room, players, player }) {
  const remainingPlayers = [];
  const lastPlayerNo = players[players.length - 1]?.no ?? 0;
  for (let i = 1; i <= room.roomSize - players.length; i++) {
    remainingPlayers.push({ no: i + lastPlayerNo });
  }

  return (
    <div className="lobby">
      <p className="heading">Waiting for players</p>
      <ul className="players">
        {players.map((curPlayer) => {
          return (
            <li className="player" key={`player-${curPlayer.id}`}>
              Player {curPlayer.no} {curPlayer.id === player.id ? "(You)" : ""}
              <span className="player-status joined">
                <BiCheck />
              </span>
            </li>
          );
        })}

        {remainingPlayers.map((player) => (
          <li className="player" key={`player-${player.no}`}>
            {`Player ${player.no}`}
            <span className="player-status">
              <Spinner />
            </span>
          </li>
        ))}
      </ul>

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
    </div>
  );
}

function Share() {
  const [copied, setCopied] = useState(false);
  const link = window.location.href;
  const [showShare] = useState(() => "share" in window.navigator);

  const handleCopy = () => {
    if (!copied) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "",
      text: "Play pair quest with me",
      url: link,
    };
    try {
      await window.navigator.share(shareData);
    } catch (err) {
      console.log("err:", err);
    }
  };

  return (
    <div>
      <p className="message">Invite your friends to join you</p>
      <div className="btns">
        <CopyToClipboard text={link} onCopy={handleCopy}>
          <button className="copy-btn">
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </CopyToClipboard>
        {showShare && (
          <button className="share-btn" onClick={handleShare}>
            Share
          </button>
        )}
      </div>

      <style jsx>{`
        .message {
          text-align: center;
          margin-bottom: 10px;
          margin-top: 20px;
          color: var(--gray-dark);
        }
        .btns {
          position: relative;
          display: flex;
          gap: 10px;
          align-items: center;
          background: var(--subtle-gray);
          padding: 8px 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .btns button {
          flex: 1;
          border: none;
          white-space: nowrap;
          background: white;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
          height: 36px;
          padding: 0 8px;
          font-size: 16px;
          border-radius: 3px;
          cursor: pointer;
        }

        .btns .share-btn {
          background: var(--orange);
          color: white;
        }

        .copied {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--orange);
          color: white;
          display: inline-block;
          padding: 4px 8px;
          border-radius: 3px;
          animation: copied 0.1s ease;
        }

        @keyframes copied {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
