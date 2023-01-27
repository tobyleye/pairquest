import { useRouter } from "next/router";
import { BaseModal } from "../base-modal";
import { useSocket } from "../../contexts/SocketContext";
import { useEffect, useState } from "react";

export function Disconnected() {
  const router = useRouter();

  const socket = useSocket();

  const [show, setShow] = useState(false);

  useEffect(() => {
    const onDisconnect = () => {
      setShow(true);
    };
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <BaseModal open={show} disableCloseOnOverlayClick>
      <div className="disconnected">
        <div className="icon">😞</div>
        <h3 className="message">Oops, you have been disconnected</h3>
        <button onClick={() => router.push("/")} className="btn btn-primary">
          Start new game
        </button>
      </div>

      <style jsx>{`
        .disconnected {
          text-align: center;
        }
        .icon {
          font-size: 50px;
          margin-bottom: 8px;
        }
        .message {
          margin-bottom: 20px;
        }
      `}</style>
    </BaseModal>
  );
}
