import { Children, cloneElement, useState } from "react";
import { BaseModal } from "./base-modal";
import { Confetti } from "./confetti";
import { useElementSize } from "../hooks/useElementSize";
import clsx from "clsx";

export function Results({ interval = 0.24, children }) {
  return (
    <div className="results">
      {Children.map(children, (child, index) => {
        const element = cloneElement(child, {
          animationDelay: `${index * interval}s`,
          key: index,
        });
        return element;
      })}
    </div>
  );
}

Results.Item = function ResultsItem({ label, value, fill, animationDelay }) {
  return (
    <div
      className={clsx("result-item", fill && "fill")}
      style={{
        animationDelay: animationDelay,
      }}
    >
      {label}
      <span>{value}</span>
    </div>
  );
};

export function Header({ heading, subHeading }) {
  return (
    <header className="game-result_header">
      <h3 className="game-result_heading">{heading}</h3>
      <p className="game-result_sub-heading">{subHeading}</p>
    </header>
  );
}

export function GameResultModal({ children, showConfetti }) {
  const [modalSize, setModalElement] = useElementSize();

  return (
    <>
      <BaseModal open={true} disableCloseOnOverlayClick ref={setModalElement}>
        {showConfetti && (
          <Confetti width={modalSize.width} height={modalSize.height} />
        )}
        <div
          style={{
            height: "100%",
          }}
        >
          <div className="game-result">{children}</div>
        </div>
        <style jsx global>{`
          .game-result {
            padding: 14px 4px;
          }

          .game-result_header {
            text-align: center;
            animation: slide_in_left 0.8s ease;
          }

          .game-result_heading {
            margin-bottom: 10px;
            color: var(--gray-2x-dark);
            font-size: 30px;
          }

          .game-result_sub-heading {
            color: #7191a5;
            font-weight: 600;
            margin-bottom: 38px;
            font-size: 14px;
          }

          .results {
            display: grid;
            grid-gap: 14px;
            margin-bottom: 20px;
          }

          .result-item {
            background: var(--subtle-gray);
            color: var(--text-gray);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            animation: slide_in_up 0.6s ease;
            animation-fill-mode: both;
          }

          .result-item span {
            color: var(--gray-2x-dark);
            font-weight: 700;
            font-size: 20px;
          }

          .result-item.fill {
            background: var(--gray-2x-dark);
            color: white;
          }

          .result-item.fill span {
            color: inherit;
          }

          .game-result_btns {
            margin-top: 35px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          .game-result_btns-stack {
            grid-template-columns: 1fr;
          }

          @keyframes slide_in_up {
            0% {
              transform: translateY(25px);
              opacity: 0;
            }

            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes slide_in_left {
            0% {
              transform: translateX(-40px);
              opacity: 0;
            }

            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>
      </BaseModal>
    </>
  );
}
