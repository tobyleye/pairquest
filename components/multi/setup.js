import { BaseModal } from "../base-modal";
import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
export function Setup({
  loaded,
  roomInfo,
  players,
  player,
  roomNotFound,
  startCountdown,
  onStartGame,
}) {
  return (
    <BaseModal open={true} disableCloseOnOverlayClick>
      <div>
        {!loaded ? (
          <Spinner />
        ) : roomNotFound ? (
          <div className="not-found">
            <div className="icon">😞</div>
            <p className="text">Room not found!</p>
          </div>
        ) : (
          <div>
            <p>Players</p>
            <ul className="player-list">
              {Array.from({ length: roomInfo.noOfPlayers }).map((_, i) => {
                let p = players[i];
                if (p) {
                  return (
                    <li className="player" key={`player-${p.id}`}>
                      Player {p.no} {p.id === player.id ? "(You)" : ""}
                      <span></span>
                    </li>
                  );
                } else {
                  return (
                    <li className="player" key={`player-${i}`}>
                      Player {i + 1}
                      <span></span>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        )}
        {startCountdown && <Countdown onDone={onStartGame} />}

        <ShareLink room={roomInfo?.id} />
      </div>
      <style jsx>{`
        .not-found {
          text-align: center;
        }

        .not-found .icon {
          font-size: 50px;
          margin-bottom: 2px;
        }

        .not-found .text {
          font-size: 18px;
          color: var(--gray-dark);
        }

        .player {
          display: flex;
          align-items: center;
        }

        .player-status {
          margin-left: auto;
        }
      `}</style>
    </BaseModal>
  );
}

function Countdown({ onDone }) {
  const [secs, setSecs] = useState(3);
  useEffect(() => {
    let timeout;
    if (secs > 0) {
      timeout = setTimeout(() => {
        setSecs((secs) => secs - 1);
      }, 1000);
    } else {
      onDone();
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [secs, onDone]);

  return (
    <div className="countdown">
      <span>{secs}</span>
    </div>
  );
}

function Spinner() {
  return (
    <div className="spinner">
      <style jsx>{`
        .spinner {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

function ShareLink({ room }) {
  const [copied, setCopied] = useState(false);
  const link = window.location.href.split("?")[0];

  return (
    <div className="share-link">
      <CopyToClipboard
        text={link}
        onCopy={() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1000);
        }}
      >
        <div>{room}</div>
      </CopyToClipboard>
      {copied && <span className="copied">copied</span>}
      <style jsx>{`
        .share-link {
          color: var(--text-gray);
          position: relative;
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
