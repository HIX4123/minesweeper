import Cell from './Cell.js';

export default class Board {
  constructor(width, height, mineCount) {
    this.width = width;
    this.height = height;
    this.mineCount = mineCount;

    this.cells = Board.#createEmptyBoard(width, height);
    Board.#placeMines(this.cells, width, height, mineCount);
    Board.#calculateAdjacents(this.cells, width, height);

    this.openedCellsCount = 0;
    this.state = 'IN_PROGRESS'; // IN_PROGRESS, WON, LOST
  }

  static #createEmptyBoard(width, height) {
    return Array.from({ length: height }, () => Array.from({ length: width }, () => new Cell()));
  }

  static #placeMines(cells, width, height, mineCount) {
    let placedMines = 0;
    while (placedMines < mineCount) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (!cells[y][x].isMine) {
        cells[y][x].isMine = true;
        placedMines++;
      }
    }
  }

  static #calculateAdjacents(cells, width, height) {
    const directions = Board.#DIRECTIONS;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (cells[y][x].isMine) continue;

        let adjMines = 0;
        for (const [dx, dy] of directions) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (cells[ny][nx].isMine) {
              adjMines++;
            }
          }
        }
        cells[y][x].adjacentMines = adjMines;
      }
    }
  }

  static #DIRECTIONS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  openCell(x, y) {
    if (this.outOfBounds(x, y) || this.state !== 'IN_PROGRESS') return;

    const cell = this.cells[y][x];
    if (cell.isOpen || cell.isFlagged) return;

    if (cell.isMine) {
      this.state = 'LOST';
      this.openAllMines();
      return;
    }

    this.BFS_reveal_from(x, y);

    if (this.openedCellsCount === this.width * this.height - this.mineCount) {
      this.state = 'WON';
      return;
    }
  }

  outOfBounds(x, y) {
    return x < 0 || x >= this.width || y < 0 || y >= this.height;
  }

  BFS_reveal_from(x, y) {
    const queue = [];
    let head = 0;
    const visited = new Set();
    queue.push([x, y]);

    while (head < queue.length) {
      const [cx, cy] = queue[head++];

      if (this.outOfBounds(cx, cy)) continue;

      if (visited.has(cy * this.width + cx)) continue;
      visited.add(cy * this.width + cx);

      const cell = this.cells[cy][cx];
      if (cell.isOpen || cell.isFlagged) continue;
      if (cell.isMine) continue;

      cell.isOpen = true;
      this.openedCellsCount++;

      if (cell.adjacentMines > 0) continue;

      for (const [dx, dy] of Board.#DIRECTIONS) {
        const nx = cx + dx;
        const ny = cy + dy;

        if (this.outOfBounds(nx, ny)) continue;

        const neighbor = this.cells[ny][nx];
        if (neighbor.isOpen || neighbor.isFlagged) continue;
        queue.push([nx, ny]);
      }
    }
  }

  openAllMines() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        cell.isOpen = true;
      }
    }
  }

  toggleFlag(x, y) {
    if (this.outOfBounds(x, y) || this.state !== 'IN_PROGRESS') return;

    const cell = this.cells[y][x];
    if (cell.isOpen) return;

    cell.isFlagged = !cell.isFlagged;
  }

  getCell(x, y) {
    if (this.outOfBounds(x, y)) return null;
    return this.cells[y][x];
  }

  getState() {
    return this.state;
  }
}
