import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";

function superAdminOnly(Component) {
  return function Wrapper(props) {
    const [password, setPassword] = useState("");
    const [grantAccess, setGrantAccess] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        setGrantAccess(true);
      } else {
        setError(true);
      }
    };

    if (grantAccess) {
      return <Component {...props} />;
    }

    return (
      <div className="auth">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <h3>Internal Page!</h3>
            <input
              type="password"
              required
              value={password}
              className={error ? "error" : ""}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button>Login</button>
          </form>
        </div>
        <style jsx>{`
          .auth {
            background: rgba(0, 0, 0, 0.4);
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: grid;
            place-items: center;
          }

          .card {
            background: white;
            width: 400px;
            max-width: 340px;
            padding: 40px;
          }

          .card h3 {
            margin-bottom: 15px;
          }
          .card input {
            width: 100%;
            display: block;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            font-size: 16px;
            padding: 5px;
          }

          .card input.error {
            border-color: red;
          }

          .card button {
            padding: 4px 6px;
          }
        `}</style>
      </div>
    );
  };
}

function Stats() {
  const socket = useSocket();

  const [stats, setStats] = useState({
    gamesPlayed: null,
    linksCreated: null,
  });

  useEffect(() => {
    socket.emit("stats", (stats) => {
      setStats(stats);
    });
  }, []);

  useEffect(() => {
    const updateStats = (update) => {
      setStats((stats) => ({
        ...stats,
        ...update,
      }));
    };
    socket.on("stats", updateStats);

    return () => {
      socket.off("stats", updateStats);
    };
  }, []);

  return (
    <div className="page-container">
      <h3 className="heading">Stats</h3>

      <div className="stats-list">
        <div className="stats-card">
          <span>Games Played</span>
          <span className="value">{stats.gamesPlayed ?? 0}</span>
        </div>

        <div className="stats-card">
          <span>Rooms Created</span>
          <span className="value">{stats.linksCreated ?? 0}</span>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 600px;
          margin: 40px auto;
        }
        .heading {
          margin-bottom: 20px;
          text-align: center;
        }
        .stats-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .stats-card {
          border: 1px solid #ccc;
          padding: 30px 20px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stats-card .value {
          font-size: 30px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

export default superAdminOnly(Stats);
