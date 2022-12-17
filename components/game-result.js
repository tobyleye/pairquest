import clsx from "clsx";
import { useRouter } from "next/router";
import { useRef } from "react";
import { BaseModal } from "./base-modal";
import { Confetti } from "./confetti";

export function GameResult({
  results,
  heading,
  subheading,
  onRestart,
  showConfetti,
}) {
  const router = useRouter();
  const modalRef = useRef();

  return (
    <>
      <BaseModal open={true} disableCloseOnOverlayClick ref={modalRef}>
        {showConfetti && (
          <Confetti
            width={modalRef?.current?.clientWidth}
            height={modalRef?.current?.clientHeight}
            duration={9000}
          />
        )}
        <div className="game-result">
          <header className="header">
            <h3 className="heading">{heading}</h3>
            <p className="sub-heading">{subheading}</p>
          </header>
          <div className="results">
            {results.map((item, index) => {
              return (
                <div key={index} className={clsx("result-item", item.highlight && "highlight")}>
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
            grid-gap: 10px;
            margin-bottom: 20px;
          }

          .result-item {
            background: var(--subtle-gray);
            color: var(--text-gray);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
          }

          .result-item span {
            color: var(--gray-2x-dark);
            font-weight: 700;
            font-size: 18px;
          }

          .result-item.highlight {
              background: var(--gray-2x-dark);
              color: white;
          } 

          .result-item.highlight span{
            color: inherit;
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
    </>
  );
}
