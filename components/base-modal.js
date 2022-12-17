import { forwardRef } from "react";

export const BaseModal = forwardRef(
  (
    { children, disableCloseOnOverlayClick, open, onOpenChange, beforeContent},
    forwardedRef
  ) => {
    const handleOverlayClick = () => {
      if (!disableCloseOnOverlayClick) {
        onOpenChange?.(false);
      }
    };

    if (!open) return null;

    return (
      <div className="modal fixed">
        <div className="overlay fixed" onClick={handleOverlayClick}></div>
        {beforeContent && (
          <div className="before-content fixed">
            {beforeContent}
          </div>
        )}
        <div className="content" ref={forwardedRef}>
          {children}
        </div>
        <style jsx>{`
          .modal {
            display: grid;
            place-items: center;
            z-index: 10;
            padding: 20px;
          }
          .fixed {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .overlay {
            background: rgba(0, 0, 0, 0.5);
          }

          .before-content {
            
          }
          .content {
            position: relative;
            z-index: 1;
            background: white;
            max-width: 400px;
            width: 100%;
            padding: 40px;
            border-radius: 8px;
          }
        `}</style>
      </div>
    );
  }
);

BaseModal.displayName = "BaseModal";
