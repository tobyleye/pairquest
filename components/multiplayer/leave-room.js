import { useRouter } from "next/router";
import { BaseModal } from "../base-modal";
import { useState } from "react";
import { useSocket } from "../../contexts/SocketContext";

export function LeaveRoom({ players }) {
  const [confirm, setConfirm] = useState(false);

  const router = useRouter();
  const socket = useSocket();

  const leave = () => {
    socket.emit("leave_room");
    router.push("/");
  };

  const confirmLeave = () => {
    if (players && players.length > 1) {
      setConfirm(true);
      return;
    }
    leave();
  };

  return (
    <>
      <button className="btn btn-primary" onClick={confirmLeave}>
        leave
      </button>

      <BaseModal open={confirm}>
        <div className="confirm-leave">
          <header>
            <h3>Leave Game?</h3>

            <p>
              This will harm the experience of other players. Are you sure about
              this?
            </p>
          </header>
          <div className="btns">
            <button className="btn btn-primary" onClick={leave}>
              yep
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setConfirm(false)}
            >
              no
            </button>
          </div>

          <style jsx>{`
            .confirm-leave header {
              text-align: center;
              margin-bottom: 20px;
            }

            .confirm-leave h3 {
              margin-bottom: 6px;
              font-size: 22px;
            }

            .confirm-leave p {
              margin-bottom: 29px;
            }

            .confirm-leave .btns {
              display: flex;
              align-items: center;
              gap: 10px;
            }
          `}</style>
        </div>
      </BaseModal>
    </>
  );
}
