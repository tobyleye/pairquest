
const Player = require('./player')
const shortId = require("shortid");
const { generateBoardItems } = require("../utils.cjs");

class Room {
    constructor({ io, id, noOfPlayers, gridSize, theme, host }) {
      this.theme = theme;
      this.size = noOfPlayers;
      this.host = host 
      this.io = io;
      this.id = id ?? shortId.generate();
      this.players = [];
      this.boardItems = Array.from({ length: gridSize[0] * gridSize[1] });
      this.gridSize = gridSize;
      this.playing = false;
      this.nextPlayerIndex = null;
      this.flippedPairs = new Set();
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
  
      if (this.players.length === 0 && 
          process.env.NODE_ENV === "production") {
        // clean room
        delete rooms[this.id];
      }
    }
  
    nextPlayer() {
      if (this.nextPlayerIndex === this.players.length - 1) {
        this.nextPlayerIndex = 0;
      } else {
        this.nextPlayerIndex += 1;
      }
      const player = this.getNextPlayer();
      this.broadcast("next_player", player?.id);
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
          this.flippedPairs = new Set();
          this.opened.push(i, j);
          this.getPlayer(socket.id)?.addScore()
          this.broadcast("update_opened", this.opened);
          this.broadcast("update_flipped_pairs", []);
          this.broadcast("update_players", this.players);
          if (this.opened.length === this.boardItems.length) {
            this.broadcast("game_over");
          }
        } else {
          this.flippedPairs = new Set();
          this.broadcast("update_flipped_pairs", [], true);
          this.nextPlayer();
        }
      }
    }
    
    restart() {
      this.boardItems = generateBoardItems(this.gridSize, this.theme)
      this.nextPlayerIndex = 0
      const nextPlayer = this.getNextPlayer();
  
      this.flippedPairs = new Set()
      this.opened = []
      this.broadcast("next_player", nextPlayer.id);
      this.broadcast('restart', {
        boardItems: this.boardItems,
        nextPlayer: nextPlayer.id,
      })
    } 
  
    // 
    gameover() {
      this.broadcast("game_over");
    }
  
    startGame() {
      this.nextPlayerIndex = 0;
      const nextPlayer = this.getNextPlayer();
      this.broadcast("next_player", nextPlayer.id);
      this.boardItems = generateBoardItems(this.gridSize, this.theme);
      this.broadcast("start_game", {
        boardItems: this.boardItems,
      });
    }
  
    getNextPlayerNo() {
      const lastPlayer = this.players[this.players.length -1]
      if (lastPlayer) {
        return lastPlayer.no + 1
      }
      return 1
    }
  
    join(socket, cb) {
      if (this.players.length === this.size) {
        cb(null);
        return;
      }
      const player = new Player({
        id: socket.id, 
        no: this.getNextPlayerNo(),
        isHost: socket.id === this.host
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
    createRoom
  }