import Board from '../engine/js/Board.js';

let board;

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');
const widthRange = document.getElementById('width-range');
const heightRange = document.getElementById('height-range');
const minesRange = document.getElementById('mines-range');
const widthValue = document.getElementById('width-value');
const heightValue = document.getElementById('height-value');
const minesValue = document.getElementById('mines-value');

init();

function init() {
  const width = Number(widthRange.value);
  const height = Number(heightRange.value);
  const mines = Math.min(Number(minesRange.value), width * height);

  board = new Board(width, height, mines);

  boardElement.style.gridTemplateColumns = `repeat(${width}, 32px)`;
  boardElement.innerHTML = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.dataset.x = x;
      cellElement.dataset.y = y;
      boardElement.appendChild(cellElement);
    }
  }

  render();
}

function syncMinesMax() {
  const width = Number(widthRange.value);
  const height = Number(heightRange.value);
  const maxMines = width * height;

  minesRange.max = String(maxMines);
  if (Number(minesRange.value) > maxMines) {
    minesRange.value = String(maxMines);
  }
  minesValue.textContent = minesRange.value;
}

function updateSettingValue() {
  widthValue.textContent = widthRange.value;
  heightValue.textContent = heightRange.value;
  minesValue.textContent = minesRange.value;
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

widthRange.addEventListener('input', () => {
  updateSettingValue();
  syncMinesMax();
});

heightRange.addEventListener('input', () => {
  updateSettingValue();
  syncMinesMax();
});

minesRange.addEventListener('input', () => {
  updateSettingValue();
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
  if (board.getState() !== 'IN_PROGRESS') {
    alert(`You ${board.getState() === 'WON' ? 'won' : 'lost'}!`);
  }
}

updateSettingValue();
syncMinesMax();
