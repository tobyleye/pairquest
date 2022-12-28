export function BoardLayout({  menu, footer, children }) {
  return (
    <div className="screen-layout">
      <div className="screen-container">
      <header className="header">
        <h1>memory</h1>
        {menu}
      </header>
      <main className="body">{children}</main>
      <footer className="footer">{footer}</footer>

      </div>

      <style jsx>{`
        .screen-layout {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }

        .screen-container {
          max-width: 940px;
          height: 100%;
          margin: auto;
          display: grid;
          grid-template-rows: auto 1fr auto;
        }

        .header {
          padding: 18px 18px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer {
          padding: 10px 18px;
          padding-bottom: 15px;
          background: white;
        }
      `}</style>
    </div>
  );
}
