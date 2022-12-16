import { useRouter } from "next/router";
import { BaseModal } from "../base-modal";

export function GameResult({ results, heading, subheading, onRestart }) {
  const router = useRouter();
  return (
    <BaseModal open={true} disableCloseOnOverlayClick>
      <div className="game-result">
        <header className="header">
          <h3 className="heading">{heading}</h3>
          <p className="sub-heading">{subheading}</p>
        </header>
        <div className="results">
          {results.map((item, index) => {
            return (
              <div key={index} className="result-item">
                {item.label}
                <span>{item.value}</span>
              </div>
            );
          })}
        </div>
        <div className="btns">
          <button className="btn" onClick={onRestart}>
            Restart
          </button>
          <button className="btn btn-orange" onClick={() => router.push("/")}>
            New Game
          </button>
        </div>
      </div>
      <style jsx>{`
        .game-result {
          padding: 14px 4px;
        }

        .header {
          text-align: center;
        }

        .heading {
          margin-bottom: 8px;
          color: var(--gray-2x-dark);
          font-size: 30px;
        }

        .sub-heading {
          color: #7191a5;
          margin-bottom: 32px;
        }

        .results {
          display: grid;
          grid-gap: 15px;
          margin-bottom: 20px;
        }

        .result-item {
          background: var(--subtle-gray);
          color: var(--text-gray);
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        .result-item span {
          color: var(--gray-2x-dark);
          font-weight: 700;
          font-size: 16px;
        }

        .btns {
          margin-top: 40px;
          display: flex;
          gap: 14px;
        }

        .btns > button {
          flex: 1;
        }
      `}</style>
    </BaseModal>
  );
}
