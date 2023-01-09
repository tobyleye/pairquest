const Player = require("./player.js");
const shortid = require("shortid");
const { generateBoardItems } = require("./utils");

class Room {
  constructor({ io, id, noOfPlayers, gridSize, theme, host }) {
    this.theme = theme;
    this.size = noOfPlayers;
    this.host = host;
    this.io = io;
    this.id = id ?? shortid.generate();
    this.players = [];
    this.boardItems = [];
    this.gridSize = gridSize;
    this.playing = false;
    this.nextPlayerIndex = null;
    this.nextPlayer = null;
    this.flippedPairs = new Set();
    this.opened = [];
    this.closed = false
  }

  broadcast(event, ...args) {
    this.io.to(this.id).emit(event, ...args);
  }

  resetFlippedPairs() {
    this.flippedPairs = new Set();
  }

  leave(socket) {
    socket.leave(this.id);
    const playerIndex = this.players.findIndex((p) => p.id === socket.id);
    if (playerIndex > -1) {
      const player = this.players[playerIndex];
      this.players.splice(playerIndex, 1);
      socket.broadcast.emit("player_leave", player);
      this.broadcast("update_players", this.players);
      if (this.nextPlayer && this.nextPlayer.id === socket.id) {
        this.setNextPlayer();
      }
    }

    if (this.players.length === 0) {
      // open room if room is empty
      // this is only useful in dev mode 
      this.closed = false 
    }

    if (this.players.length === 0 && process.env.NODE_ENV === "production") {
      // clean room
      delete rooms[this.id];
    }
  }

  resetNextPlayer() {
    this.nextPlayerIndex = 0;
    this.nextPlayer = this.players[this.nextPlayerIndex];
    this.broadcast("next_player", this.nextPlayer.id);
  }

  setNextPlayer() {
    if (this.nextPlayerIndex >= this.players.length - 1) {
      this.nextPlayerIndex = 0;
    } else {
      this.nextPlayerIndex += 1;
    }
    this.nextPlayer = this.players[this.nextPlayerIndex];
    this.broadcast("next_player", this.nextPlayer.id);
  }

  getPlayer(id) {
    return this.players.find((player) => player.id === id);
  }

  handlePlay(index, socket) {
    this.flippedPairs.add(index);
    const flippedPairs = [...this.flippedPairs];
    this.broadcast("update_flipped_pairs", flippedPairs);

    if (flippedPairs.length === 2) {
      let [i, j] = flippedPairs;
      let pair1 = this.boardItems[i];
      let pair2 = this.boardItems[j];
      if (pair1 === pair2) {
        this.opened.push(i, j);
        this.resetFlippedPairs();
        const player = this.getPlayer(socket.id);
        player.addScore();
        this.broadcast("update_opened", this.opened);
        this.broadcast("update_flipped_pairs", []);
        this.broadcast("update_players", this.players);
        if (this.opened.length === this.boardItems.length) {
          this.broadcast("game_over");
        }
      } else {
        this.resetFlippedPairs();
        this.broadcast("update_flipped_pairs", [], true);
        this.setNextPlayer();
      }
    }
  }

  resetPlayersScore() {
    this.players.forEach((player) => {
      player.resetScore();
    });
  }

  restart() {
    this.boardItems = generateBoardItems(this.gridSize, this.theme);
    this.resetFlippedPairs();
    this.resetPlayersScore();
    this.opened = [];
    this.resetNextPlayer();
    this.broadcast("restart", {
      boardItems: this.boardItems,
      nextPlayer: this.nextPlayer.id,
      players: this.players,
    });
  }

  //
  gameover() {
    this.broadcast("game_over");
  }

  startGame() {
    this.resetNextPlayer();
    this.boardItems = generateBoardItems(this.gridSize, this.theme);
    this.broadcast("start_game", {
      boardItems: this.boardItems,
    });
    // close room to any other connections
    this.closed = true
  }

  getNextPlayerNo() {
    const lastPlayer = this.players[this.players.length - 1];
    if (lastPlayer) {
      return lastPlayer.no + 1;
    }
    return 1;
  }

  determineHost(socket) {
    if (process.env.NODE_ENV !== "production" && this.players.length === 0) {
      return true;
    }
    return socket.id === this.host;
  }

  join(socket, cb) {
    if (this.closed || this.players.length === this.size) {
      cb(null);
      return;
    }

    const isHost = this.determineHost(socket);

    const player = new Player({
      id: socket.id,
      no: this.getNextPlayerNo(),
      isHost,
    });

    this.players.push(player);

    socket.join(this.id);
    socket.room = this;

    let roomInfo = {
      noOfPlayers: this.size,
      gridSize: this.gridSize,
      id: this.id,
      theme: this.theme,
    };

    cb(player, roomInfo);

    this.broadcast("update_players", this.players);

    // start game automatically when last user joins
    if (this.players.length === this.size) {
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

module.exports = {
  rooms,
  createRoom,
};
