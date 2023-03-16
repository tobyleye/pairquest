import Link from "next/link";
import { BaseModal } from "../../base-modal";
import { useEffect, useState } from "react";
import { Spinner } from "../../spinner";
import { StartCountdown } from "../../start-countdown";
import { useSocket } from "../../../contexts/SocketContext";
import { Lobby } from "./lobby";
import { Share } from "./share";

export function Setup({ onStart, players, player, room, loading }) {
  const [startCountdown, setStartCountdown] = useState(false);

  const socket = useSocket();

  useEffect(() => {
    const countdown = () => {
      setStartCountdown(true);
    };
    socket.on("start_game", countdown);
    return () => {
      socket.off("start_game", countdown);
    };
  }, []);

  const startAnyway = () => socket.emit("start");

  const countdownFinish = () => {
    onStart();
  };

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
          <StartCountdown onEnd={countdownFinish} />
        ) : (
          <div>
            <Lobby room={room} players={players} player={player} />
            {room.roomSize > 2 &&
            players.length > 1 &&
            player.isHost === true ? (
              <div className="start-block">
                <button
                  onClick={startAnyway}
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
