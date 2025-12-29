import Cell from "./Cell";

export default class Board {
    constructor(width, height, mineCount) {
        this.width = width;
        this.height = height;
        this.mineCount = mineCount;

        this.cells = this.#createBoard();
    }

    #createBoard() {
        const cells = Array.from({length: this.height}, () =>Array.from({length: this.width}, () => (new Cell(false))));
        
        return cells;
    }

}