import clsx from "clsx";
import { useAppState } from "../contexts/AppStateContext";

export function ShamelessPlug({ light }) {
  const { showPlug } = useAppState();
  return (
    <div className={clsx("plug", light && "light", showPlug && "show")}>
      <p>
        A thing built by{" "}
        <a target="_blank" href="https://oluwatobi.vercel.app" rel="noreferrer">
          Tobi
        </a>
      </p>

      <style jsx>{`
        .plug {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 10px 0 20px;
          text-align: center;
          color: var(--subtle-gray);
          transform: translateY(20px);
          opacity: 0;
          /* animation: plug 0.5s ease;
          animation-delay: 0.24s;
          animation-fill-mode: both; */
        }

        .plug.show {
          transition: 0.5s ease;
          transition-delay: 0.25s;
          transform: translateY(0);
          opacity: 1;
        }

        .plug a {
          border-bottom: 1px solid;
        }

        .plug.light {
          color: var(--gray-2x-dark);
        }

        .plug.light a {
          color: var(--gray-2x-dark);
        }

        @keyframes plug {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to: {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
