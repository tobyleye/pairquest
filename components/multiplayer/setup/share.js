import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export function Share() {
  const [copied, setCopied] = useState(false);
  const link = window.location.href;
  const [showShare] = useState(() => "share" in window.navigator);

  const handleCopy = () => {
    if (!copied) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "",
      text: "Play pairquest with me",
      url: link,
    };
    try {
      await window.navigator.share(shareData);
    } catch {}
  };

  return (
    <div>
      <p className="message">Invite your friends to join you</p>
      <div className="btns">
        <CopyToClipboard text={link} onCopy={handleCopy}>
          <button className="copy-btn">
            {copied ? <span className="copied">Copied!</span> : "Copy Link"}
          </button>
        </CopyToClipboard>
        {showShare && (
          <button className="share-btn" onClick={handleShare}>
            Share
          </button>
        )}
      </div>

      <style jsx>{`
        .message {
          text-align: center;
          margin-bottom: 10px;
          margin-top: 20px;
          font-size: 14px;
          line-height: 20px;
          color: var(--gray-dark);
        }

        .btns {
          position: relative;
          display: flex;
          gap: 10px;
          align-items: center;
          background: var(--subtle-gray);
          padding: 8px 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .btns button {
          flex: 1;
          border: none;
          white-space: nowrap;
          background: white;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
          height: 36px;
          padding: 0 8px;
          font-size: 16px;
          border-radius: 3px;
          cursor: pointer;
        }

        .btns .share-btn {
          background: var(--orange);
          color: white;
        }

        .copied {
          display: inline-block;
          animation: copied 0.2s ease;
        }

        @keyframes copied {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
