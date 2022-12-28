import clsx from "clsx";

export function ShamelessPlug({ light }) {
  return (
    <div className={clsx("plug", light && "light")}>
      <p>
        A thing built with ♥ by{" "}
        <a target="_blank" href="https://twitter.com" rel="noreferrer">
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
      `}</style>
    </div>
  );
}
