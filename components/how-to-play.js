import { BaseModal } from "./base-modal";
import { useState } from "react";

export function HowToPlay() {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="how-to-play">
        <button className="how-to-play-btn" onClick={() => setShow(true)}>
          how to play?
        </button>
      </div>
      <BaseModal open={show} onOpenChange={setShow}>
        <div className="how-to-play-content">
          <h3>PairQuest</h3>
          <p>
            ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
          </p>
          <p>
            ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
          </p>
          <p>
            ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
          </p>
          <button className="btn btn-primary" onClick={() => setShow(false)}>
            gotcha
          </button>
        </div>
      </BaseModal>
      <style jsx>{`
        .how-to-play-btn {
          border: none;
          outline: none;
          background: transparent;
          color: white;
          font-size: 14px;
          cursor: pointer;
          color: var(--subtle-gray);
        }
        .how-to-play-content {
          border: 1px solid red;
        }
      `}</style>
    </>
  );
}
