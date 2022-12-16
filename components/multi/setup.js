import { BaseModal } from "../base-modal";
import { useState, useEffect } from "react";

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
            <div>loading..</div>
          ) : roomNotFound ? (
            <div>room not found</div>
          ) : (
            <div>
              <p>Players</p>
              <ul>
                {Array.from({ length: roomInfo.noOfPlayers }).map((_, i) => {
                  let p = players[i];
                  if (p) {
                    return (
                      <li key={`player-${p.id}`}>
                        Player {p.id} {p.id === player.id ? "(You)" : ""}
                      </li>
                    );
                  } else {
                    return (
                      <li key={`player-${i}`}>waiting for player {i + 1}</li>
                    );
                  }
                })}
              </ul>
            </div>
          )}
          {startCountdown && <Countdown onDone={onStartGame} />}
        </div>
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
  