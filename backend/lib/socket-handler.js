import { rooms, createRoom } from "./room.js";

export function createSocketHandler(io) {
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
      console.log("join room:", { players: room?.players?.length });
      if (!room) {
        cb(null);
        return;
      }
      room.join(socket, cb);
    });

    socket.on("debug_room", (roomId) => {
      const room = rooms[roomId];
      if (room) {
        console.log({ players: room.players.length });
      }
    });

    socket.on("load_room", (roomId, cb) => {
      const room = rooms[roomId];
      if (!room || room.closed) {
        cb(null);
      } else {
        cb(room.info());
      }
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
