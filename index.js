const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const shortId = require("shortid");
const { generateBoardItems } = require("./utils.cjs");

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

class Player {
  constructor(id, no, name) {
    this.id = id;
    this.no = no;
    this.name = name;
    this.matchedPairs = 0;
  }

  incrMatchedPairs() {
    this.matchedPairs += 1;
  }

  toJSON() {
    const { id, no, name, matchedPairs } = this;
    return {
      id,
      no,
      name,
      matchedPairs,
    };
  }
}

class Room {
  constructor({ io, id, noOfPlayers, gridSize, theme }) {
    this.theme = theme;
    this.expectedPlayers = noOfPlayers;
    this.io = io;
    this.id = id ?? shortId.generate();
    this.players = [];
    this.boardItems = Array.from({ length: gridSize[0] * gridSize[1] });
    this.gridSize = gridSize;
    this.playing = false;
    this.nextPlayerIndex = null;
    this.flippedPairs = [];
    this.opened = [];
  }

  broadcast(event, ...args) {
    this.io.to(this.id).emit(event, ...args);
  }

  getNextPlayer() {
    let index = this.nextPlayerIndex;
    if (typeof index === "number" && index > -1) {
      return this.players[index];
    }
    return null;
  }

  leave(socket) {
    socket.leave(this.id);
    let playerIndex = this.players.findIndex((p) => p.id === socket.id);
    if (playerIndex > -1) {
      let player = this.players[playerIndex];
      let nextPlayer = this.getNextPlayer();
      this.players.splice(playerIndex, 1);
      socket.broadcast.emit("player_leave", player);
      this.broadcast("update_players", this.players);
      if (nextPlayer && nextPlayer.id === socket.id) {
        this.nextPlayer();
      }
    }
  }

  nextPlayer() {
    if (this.nextPlayerIndex === this.players.length - 1) {
      this.nextPlayerIndex = 0;
    } else {
      this.nextPlayerIndex += 1;
    }
    const player = this.getNextPlayer();
    this.broadcast("next_player", player.id);
  }

  getPlayer(id) {
    return this.players.find(player => player.id === id)
  }

  handlePlay(index, socket) {
    this.flippedPairs.push(index);
    this.broadcast("update_flipped_pairs", this.flippedPairs);
    if (this.flippedPairs.length === 2) {
      let [i, j] = this.flippedPairs;
      let pair1 = this.boardItems[i];
      let pair2 = this.boardItems[j];
      if (pair1 === pair2) {
        this.flippedPairs = [];
        this.opened.push(i, j);
        this.getPlayer(socket.id)?.incrMatchedPairs()
        this.broadcast("update_opened", this.opened);
        this.broadcast("update_flipped_pairs", this.flippedPairs);
        this.broadcast('update_players', this.players)
        if (this.opened.length === this.boardItems.length) {
          this.broadcast("game_over", "game");
        }
      } else {
        this.flippedPairs = [];
        this.broadcast("update_flipped_pairs", this.flippedPairs, true);
        this.nextPlayer();
      }
    }
  }

  startGame() {
    this.nextPlayerIndex = 0;
    const nextPlayer = this.getNextPlayer();
    this.broadcast("next_player", nextPlayer.id);
    this.boardItems = generateBoardItems(this.gridSize);
    this.broadcast("start_game", {
      boardItems: this.boardItems,
    });
  }

  join(socket, cb) {
    if (this.players.length === this.expectedPlayers) {
      cb(null);
      return;
    }
    const player = new Player(socket.id, this.players.length+1, null)
    this.players.push(player);
    socket.join(this.id);
    socket.room = this;
    let roomInfo = {
      noOfPlayers: this.expectedPlayers,
      gridSize: this.gridSize,
      id: this.id
    };
    cb(player, roomInfo);
    this.broadcast("update_players", this.players);
    if (this.players.length === this.expectedPlayers) {
      this.startGame();
    }
  }
}

const rooms = {};

function createRoom(opts) {
  const room = new Room(opts);
  rooms[room.id] = room;
  return room;
}

function createSocketHandler(io) {
  // create test room
  createRoom({
    io,
    id: "public",
    theme: "numbers",
    noOfPlayers: 2,
    gridSize: [4, 4],
  });

  return function (socket) {
    socket.on("create_room", ({ theme, noOfPlayers, gridSize }, cb) => {
      const room = createRoom({
        io,
        theme,
        noOfPlayers,
        gridSize,
      });
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

    const handleLeave = () => {
      if (socket.room) {
        socket.room.leave(socket);
      }
    };
    socket.on("leave_room", handleLeave);

    socket.on("disconnect", handleLeave);
  };
}
