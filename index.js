const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { rooms, createRoom } = require("./server/room");
const { parse } = require("url");


const port = parseInt(process.env.PORT || "3003", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  const socketHandler = createSocketHandler(io);
  io.on("connection", socketHandler);

  server.listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});

function createSocketHandler(io) {
  return function (socket) {
    socket.on("create_room", ({ noOfPlayers, gridSize, theme }, cb) => {
      const opts = {
        io,
        theme,
        noOfPlayers,
        gridSize,
        host: socket.id,
      };
      const room = createRoom(opts);
      cb(room.id);
    });

    socket.on("join_room", (room, cb) => {
      room = rooms[room];
      if (!room) {
        cb(null);
        return;
      }
      room.join(socket, cb);
    });

    socket.on("play", ({ index }) => {
      socket.room.handlePlay(index, socket);
    });

    socket.on("start", () => {
      socket.room.startGame();
    });

    socket.on("restart", () => {
      socket.room.restart();
    });

    socket.on("_gameover", () => {
      socket.room.gameover();
    });

    const handleLeave = () => {
      if (socket.room) {
        socket.room.leave(socket);
      }
    };
    socket.on("leave_room", handleLeave);

    socket.on("disconnect", handleLeave);
  };
}
