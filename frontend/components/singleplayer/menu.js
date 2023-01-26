import { useState } from "react";
import { BaseModal } from "../base-modal";

export function SinglePlayerMenu({
  onRestart,
  pauseTimer,
  resumeTimer,
  onNewGame,
}) {
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

  return (
    <>
      <div>
        <MobileMenu open={showMenu} onClose={resume}>
          <button className="btn btn-primary" onClick={handleRestart}>
            Restart
          </button>
          <button className="btn btn-secondary" onClick={onNewGame}>
            New Game
          </button>
          <button className="btn btn-secondary" onClick={resume}>
            Resume Game
          </button>
        </MobileMenu>

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
            <button className="btn btn-secondary" onClick={onNewGame}>
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

function MobileMenu({ open, onClose, children }) {
  return (
    <BaseModal open={open} onOpenChange={onClose}>
      <div className="mobile-menu-btns">{children}</div>
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
