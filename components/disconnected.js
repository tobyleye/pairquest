import { useRouter } from "next/router";
import { BaseModal } from "./base-modal";

export function Disconnected() {
  const router = useRouter();
  return (
    <BaseModal open={true}>
      <div className="disconnected">
      <div className="icon">😞</div>
        <h3 className="message">Oops, you have been disconnected</h3>
        <button onClick={() => router.push("/")} className="btn btn-orange">
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
