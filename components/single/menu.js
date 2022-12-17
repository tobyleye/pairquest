import { useRouter } from "next/router";
import { useState } from "react";
import { BaseModal } from "../base-modal";

function MobileMenu({ onRestart, onResume }) {
  const router = useRouter();
  return (
    <BaseModal open={true} disableCloseOnOverlayClick>
      <div className="btns">
        <button className="btn btn-orange" onClick={onRestart}>
          Restart
        </button>
        <button className="btn" onClick={() => router.push("/")}>
          New Game
        </button>
        <button className="btn " onClick={onResume}>
          Resume Game
        </button>
      </div>
      <style jsx>{`
        .btns {
          display: grid;
          gap: 14px;
          background: white;
        }
      `}</style>
    </BaseModal>
  );
}

export function BoardMenu({ onNewGame, onRestart, pauseTimer, resumeTimer }) {
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    pauseTimer();
    setShowMenu(true);
  };

  const resume = () => {
    setShowMenu(false);
    resumeTimer();
  };

  const handleRestart = () => {
    setShowMenu(false);
    onRestart();
  };
  const router = useRouter();

  return (
    <>
      <div>
        {showMenu && (
          <MobileMenu
            onNewGame={onNewGame}
            onRestart={handleRestart}
            onResume={resume}
          />
        )}
        <div className="btns">
          <div className="mobile">
            <button className="btn btn-orange" onClick={openMenu}>
              menu
            </button>
          </div>
          <div className="desktop">
            <button className="btn btn-orange" onClick={handleRestart}>
              restart
            </button>
            <button className="btn" onClick={() => router.push("/")}>
              new game
            </button>
          </div>
        </div>

        <style jsx>{`
          .header {
            display: flex;
            max-width: 820px;
            margin: auto;
            justify-content: space-between;
          }

          .btns {
            display: flex;
          }

          .desktop {
            display: flex;
            gap: 6px;
            display: none;
          }

          @media (min-width: 700px) {
            .desktop {
              display: flex;
            }
            .mobile {
              display: none;
            }
          }
        `}</style>
      </div>
    </>
  );
}
