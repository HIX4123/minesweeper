import Board from '../engine/js/Board.js';

const WIDTH = 16;
const HEIGHT = 16;
const MINES = 20;

let board;

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');

init();

function init() {
  board = new Board(WIDTH, HEIGHT, MINES);

  boardElement.style.gridTemplateColumns = `repeat(${WIDTH}, 32px)`;
  boardElement.innerHTML = '';

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.dataset.x = x;
      cellElement.dataset.y = y;
      boardElement.appendChild(cellElement);
    }
  }

  render();
}

boardElement.addEventListener('click', (event) => {
  const cellElement = event.target.closest('.cell');
  if (!cellElement) return;

  const x = Number(cellElement.dataset.x);
  const y = Number(cellElement.dataset.y);

  board.openCell(x, y);
  render();
});

boardElement.addEventListener('contextmenu', (event) => {
  event.preventDefault();

  const cellElement = event.target.closest('.cell');
  if (!cellElement) return;

  const x = Number(cellElement.dataset.x);
  const y = Number(cellElement.dataset.y);

  board.toggleFlag(x, y);
  render();
});

resetButton.addEventListener('click', () => {
  init();
});

function render() {
  const cells = boardElement.children;

  for (const cellElement of cells) {
    const x = Number(cellElement.dataset.x);
    const y = Number(cellElement.dataset.y);
    const cell = board.getCell(x, y);

    cellElement.className = 'cell';
    cellElement.textContent = '';

    if (cell.isOpen) {
      cellElement.classList.add('open');

      if (cell.isMine) {
        cellElement.classList.add('mine');
        cellElement.textContent = '💣';
      } else if (cell.adjacentMines > 0) {
        cellElement.textContent = cell.adjacentMines;
      }
    } else if (cell.isFlagged) {
      cellElement.classList.add('flagged');
      cellElement.textContent = '🚩';
    }
  }

  statusElement.textContent = board.getState();
}
