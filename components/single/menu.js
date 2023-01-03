import { useRouter } from "next/router";
import { useState } from "react";
import { BaseModal } from "../base-modal";

export function SingleModeMenu({ onRestart, pauseTimer, resumeTimer }) {
  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => showMenu && setShowMenu(false);

  const openMenu = () => {
    pauseTimer();
    setShowMenu(true);
  };

  const resume = () => {
    closeMenu();
    resumeTimer();
  };

  const handleRestart = () => {
    closeMenu();
    onRestart();
  };

  const router = useRouter();

  return (
    <>
      <div>
        <MobileMenu
          open={showMenu}
          onRestart={handleRestart}
          onResume={resume}
        />
        <div className="btns">
          <div className="mobile">
            <button className="btn btn-primary" onClick={openMenu}>
              menu
            </button>
          </div>
          <div className="desktop">
            <button className="btn btn-primary" onClick={handleRestart}>
              restart
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/")}
            >
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

function MobileMenu({ open, onRestart, onResume }) {
  const router = useRouter();
  return (
    <BaseModal open={open} onOpenChange={onResume}>
      <div className="mobile-menu-btns">
        <button className="btn btn-primary" onClick={onRestart}>
          Restart
        </button>
        <button className="btn btn-secondary" onClick={() => router.push("/")}>
          New Game
        </button>
        <button className="btn btn-secondary" onClick={onResume}>
          Resume Game
        </button>
      </div>
      <style jsx>{`
        .mobile-menu-btns {
          display: grid;
          gap: 14px;
          background: white;
        }
      `}</style>
    </BaseModal>
  );
}
