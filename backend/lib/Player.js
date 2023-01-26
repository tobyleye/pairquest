export default class Player {
  constructor({ id, no, name = null, isHost = false }) {
    this.id = id;
    this.no = no;
    this.name = name;
    this.isHost = isHost;
    this.score = 0;
  }

  addScore() {
    this.score += 1;
  }

  resetScore() {
    this.score = 0;
  }
}
