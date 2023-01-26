import shortid, { generate } from "shortid";
import { generateBoardItems } from "./utils.js";
import Player from "./Player.js";

const isProd = () => process.env.NODE_ENV === "production";

class Room {
  constructor({ io, id, noOfPlayers, gridSize, theme, host }) {
    this.theme = theme;
    this.roomSize = noOfPlayers;
    this.host = host;
    this.io = io;
    this.id = id ?? shortid.generate();
    this.players = [];
    this.gridSize = gridSize;
    this.boardItems = this.generateBoardItems();
    this.nextPlayerIndex = 0;
    this.flippedPair = new Set();
    this.opened = [];
    this.closed = false;
  }

  get nextPlayer() {
    return this.players[this.nextPlayerIndex];
  }

  /*
   generate board items with room config
  */
  generateBoardItems() {
    return generateBoardItems(this.gridSize, this.theme);
  }

  /*
    broadcast event to all players in room
  */
  broadcast(event, ...args) {
    this.io.to(this.id).emit(event, ...args);
  }

  resetFlippedPair() {
    this.flippedPair = new Set();
  }

  /*  
    room info
  */
  info() {
    return {
      theme: this.theme,
      roomSize: this.roomSize,
      gridSize: this.gridSize,
    };
  }

  /*
    determine next player
  */
  updateNextPlayer() {
    if (this.nextPlayerIndex >= this.players.length - 1) {
      this.nextPlayerIndex = 0;
    } else {
      this.nextPlayerIndex += 1;
    }
  }

  /*
     broadcast next player
  */
  broadcastNextPlayer() {
    this.updateNextPlayer();
    if (this.nextPlayer) {
      this.broadcast("next_player", this.nextPlayer.id);
    }
  }

  getPlayer(id) {
    return this.players.find((player) => player.id === id);
  }

  /*
    handles player leave
  */
  leave(socket) {
    socket.leave(this.id);
    const leavingPlayerIndex = this.players.findIndex(
      (p) => p.id === socket.id
    );
    if (leavingPlayerIndex > -1) {
      const leavingPlayer = this.players[leavingPlayerIndex];
      this.players.splice(leavingPlayerIndex, 1);
      this.broadcast("player_left", leavingPlayer);
      this.broadcast("update_players", this.players);

      if (this.nextPlayer && this.nextPlayer.id === leavingPlayer.id) {
        this.broadcastNextPlayer();
      }
    }
    const deleteRoom = () => {
      if (this.players.length === 0) {
        delete rooms[this.id];
      }
    };
    if (isProd()) {
      // delete room instantly to clear up unused resources
      deleteRoom();
    } else {
      // we wait here before deleting because of react useEffect
      // behavior in dev mode.
      setTimeout(deleteRoom, 5 * 0);
    }
  }

  handlePlay(index, socket) {
    this.flippedPair.add(index);
    const flippedPair = [...this.flippedPair];
    this.broadcast("update_flipped_pair", flippedPair);

    if (flippedPair.length === 2) {
      let [i, j] = flippedPair;
      let pair1 = this.boardItems[i];
      let pair2 = this.boardItems[j];
      if (pair1 === pair2) {
        this.opened.push(i, j);
        this.resetFlippedPair();
        const player = this.getPlayer(socket.id);
        player.addScore();
        this.broadcast("match_found", {
          opened: this.opened,
          flippedPair: [],
          players: this.players,
        });
        // this.broadcast("update_opened", this.opened);
        // this.broadcast("update_flipped_pairs", []);
        // this.broadcast("update_players", this.players);
        if (this.opened.length === this.boardItems.length) {
          this.broadcast("game_over");
        }
      } else {
        this.resetFlippedPair();
        this.updateNextPlayer();
        this.broadcast("no_match", {
          flippedPair: [],
          nextPlayer: this.nextPlayer?.id,
        });
      }
    }
  }

  resetPlayersScore() {
    this.players.forEach((player) => {
      player.resetScore();
    });
  }

  restart() {
    this.boardItems = this.generateBoardItems();
    this.resetFlippedPair();
    this.resetPlayersScore();
    this.nextPlayerIndex = 0;
    this.opened = [];
    this.broadcast("restart", {
      boardItems: this.boardItems,
      nextPlayer: this.nextPlayer?.id,
      players: this.players,
    });
  }

  /*
    game over
  */
  gameover() {
    this.broadcast("game_over");
  }

  /*
    close room
  */
  closeRoom() {
    this.closed = true;
  }

  /*  
    starts new game
  */
  startGame() {
    this.boardItems = generateBoardItems(this.gridSize, this.theme);
    this.nextPlayerIndex = 0;
    this.broadcast("start_game", {
      boardItems: this.boardItems,
      nextPlayer: this.nextPlayer?.id,
    });
    // close room to any other connections
    this.closeRoom();
  }

  /*
    generate new player no
  */
  generateNewPlayerNo() {
    const lastPlayer = this.players[this.players.length - 1];
    if (lastPlayer) {
      return lastPlayer.no + 1;
    }
    return 1;
  }

  /*
    determine host
  */
  determineHost(socket) {
    if (!isProd() && this.players.length === 0) {
      return true;
    }
    return socket.id === this.host;
  }

  /*
    add player joins
  */
  join(socket, cb) {
    if (this.closed || this.players.length === this.roomSize) {
      cb(null);
      return;
    }

    const isHost = this.determineHost(socket);

    const player = new Player({
      id: socket.id,
      no: this.generateNewPlayerNo(),
      isHost,
    });

    this.players.push(player);

    socket.join(this.id);
    socket.room = this;

    cb({ player, players: this.players, room: this.info() });

    this.broadcast("update_players", this.players);

    // start game automatically when last user joins
    if (this.players.length === this.roomSize) {
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

export { rooms, createRoom };
