export default class Cell {
  constructor() {
    this.isMine = false;
    this.isOpen = false;
    this.isFlagged = false;
    this.adjacentMines = 0;
  }
}
