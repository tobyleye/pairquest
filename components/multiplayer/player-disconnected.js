import { BaseModal } from "../base-modal";
import { useRouter } from "next/router";

export function PlayerDisconnected({ players, reset, gameStatus }) {
  const router = useRouter();

  if (!players || players.length === 0) {
    return null;
  }

  if (gameStatus !== "playing") {
    return null;
  }

  const getMessage = () => {
    if (players.length <= 2) {
      return (
        players.map((player) => `Player ${player.no}`).join(" and ") + " left"
      );
    } else {
      return `${players.length} Players left`;
    }
  };

  const message = getMessage();

  return (
    <BaseModal open={true}>
      <div className="disconnected">
        <h3>{message}</h3>
        <p>Do you want to continue playing?</p>
        <div className="btns">
          <button className="btn btn-primary" onClick={reset}>
            sure
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => router.push("/")}
          >
            uhm, no
          </button>
        </div>
      </div>

      <style jsx>{`
        .disconnected {
          text-align: center;
        }

        .disconnected h3 {
          font-size: 22px;
          margin-bottom: 4px;
        }

        .disconnected p {
          margin-bottom: 25px;
        }
        .disconnected .btns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
      `}</style>
    </BaseModal>
  );
}
