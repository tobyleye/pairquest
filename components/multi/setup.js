import Link from "next/link";
import { BaseModal } from "../base-modal";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Spinner } from "../spinner";
import { BiCheck } from "react-icons/bi";
import { StartCountdown } from "./start-countdown";

export function Setup({
  loaded,
  roomInfo,
  players,
  player,
  roomNotFound,
  startCountdown,
  onCountdownFinish,
  onStart,
}) {
  return (
    <BaseModal open={true} disableCloseOnOverlayClick>
      <div>
        {!loaded ? (
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
          <StartCountdown onDone={onCountdownFinish} />
        ) : (
          <div>
            <div className="players">
              <p className="players-heading">Players</p>
              <ul className="player-list">
                {Array.from({ length: roomInfo.noOfPlayers }).map((_, i) => {
                  let p = players[i];
                  if (p) {
                    return (
                      <li className="player" key={`player-${p.id}`}>
                        Player {p.no} {p.id === player.id ? "(You)" : ""}
                        <span className="player-status joined">
                          <BiCheck />
                        </span>
                      </li>
                    );
                  } else {
                    return (
                      <li className="player" key={`player-${i}`}>
                        Player {i + 1}
                        <span className="player-status">
                          <Spinner />
                        </span>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
            {roomInfo.noOfPlayers > 2 &&
            players.length > 1 &&
            players[0].id === player.id ? (
              <div className="start-block">
                <button
                  onClick={onStart}
                  className="btn btn-primary btn-inline start-btn"
                >
                  Start anyway
                </button>
              </div>
            ) : null}
            <Share room={roomInfo?.id} />
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

        .players {
          margin-bottom: 14px;
        }
        .players-heading {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .player-list {
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
        .start-block {
          display: flex;
          justify-content: center;
          margin-bottom: 14px;
        }
        .start-btn {
          padding: 0px 40px;
          height: 38px;
        }
      `}</style>
    </BaseModal>
  );
}

function Share({ room }) {
  const [copied, setCopied] = useState(false);
  const link = window.location.href

  
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
      title: '',
      text: "Play memory game with me",
      url: link,
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log("err:", err);
    }
  };

  return (
    <div className="share-ui">
      <div className="link">{room}</div>
      <CopyToClipboard text={link} onCopy={handleCopy}>
        <button>{copied ? "Copied!" : "Copy Link"}</button>
      </CopyToClipboard>
      <button className="share" onClick={handleShare}>
        Share
      </button>

      <style jsx>{`
        .share-ui {
          color: var(--text-gray);
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 8px;
          align-items: center;
          background: var(--subtle-gray);
          padding: 14px 16px;
          border-radius: 4px;
          font-size: 14px;
          margin-top: 40px;
        }

        .share-ui .link {
        }

        .share-ui button {
          border: none;
          white-space: nowrap;
          background: white;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
          padding: 6px 8px;
          font-size: 14px;
          border-radius: 3px;
        }

        .share-ui button.share {
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
