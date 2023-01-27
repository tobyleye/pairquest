import { useEffect, useState } from "react";
import { BaseModal } from "../base-modal";
import { useRouter } from "next/router";

export function PlayerDisconnected({ socket, player, gameStarted, gameOver }) {
  const [disconnectedPlayer, setDisconnectedPlayer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!gameStarted) return;
    const handlePlayerLeft = (player) => {
      setDisconnectedPlayer(player);
    };
    socket.on("player_left", handlePlayerLeft);
    return () => {
      socket.off("player_left", handlePlayerLeft);
    };
  });

  const reset = () => {
    setDisconnectedPlayer(null);
  };

  const show = disconnectedPlayer !== null && gameOver !== true;

  if (!show) {
    return null;
  }

  return (
    <BaseModal open={true}>
      <div className="disconnected">
        <div className="other-disconnected">
          <h3>Player {disconnectedPlayer.no} left</h3>
          <p>Do you want to continue playing?</p>
          <div className="btns">
            <button className="btn btn-primary" onClick={reset}>
              sure
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/")}
            >
              nah
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .self-disconnected {
          text-align: center;
        }

        .self-disconnected .icon {
          font-size: 50px;
          margin-bottom: 8px;
        }

        .self-disconnected h3 {
          margin-bottom: 20px;
        }

        .other-disconnected {
          text-align: center;
        }

        .other-disconnected h3 {
          font-size: 22px;
          margin-bottom: 4px;
        }

        .other-disconnected p {
          margin-bottom: 25px;
        }
        .other-disconnected .btns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
      `}</style>
    </BaseModal>
  );
}
