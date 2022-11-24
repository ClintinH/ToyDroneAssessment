import { outputText } from "./script.js";
import { replaceImg } from "./script.js";

const maxColumns = 10;
const maxRows = 10;

const yMap = new Map();
const xMap = new Map();

let j = maxRows;

// invert Y axes to follow documentation so that y start at bottom of screen
for (let i = 0; i < maxRows; i++) {
  yMap.set(i, j--);
}
yMap.set(maxRows, -1);

for (let i = 0; i < maxColumns; i++) {
  xMap.set(i, i + 1);
}
xMap.set(maxColumns, -1);

console.log("drone");
console.log(xMap, yMap);

export default class Drone {
  constructor(board) {
    this.board = board;
    this.x;
    this.y;
    this.facing = "NORTH";
    this.incorrectPlace = false;
  }

  draw(delta) {
    if (this.incorrectPlace) return;
    this.board.innerHTML = "";
    let drone = document.createElement("img");
    replaceImg(drone, `img/drone${this.facing}.png`);

    drone.style.gridRowStart = yMap.get(Number(this.y));
    drone.style.gridColumnStart = xMap.get(Number(this.x));
    drone.classList.add("drone");
    this.board.appendChild(drone);
  }

  update(options) {
    if (
      options.x < 0 ||
      options.x > maxColumns - 1 ||
      options.y < 0 ||
      options.y > maxRows - 1
    ) {
      this.incorrectPlace = true;
      return outputText(
        `Incorrect values - Value must be possitive or on the board (${maxColumns}x${maxRows}. The value start at 0 until 9).
             Input value: ${options.x} , ${options.y} , ${options.facing}`
      );
    } else {
      this.incorrectPlace = false;
      this.x = options.x == null ? this.x : Number(options.x);
      this.y = options.y == null ? this.y : Number(options.y);
      this.facing = options.facing == null ? this.facing : options.facing;
    }
  }

  left() {
    this.rotate(true);
  }

  right() {
    this.rotate(false);
  }

  // rotate either left or right
  rotate(isLeft) {
    switch (this.facing) {
      case "NORTH":
        this.update({ facing: isLeft ? "WEST" : "EAST" });
        break;
      case "SOUTH":
        this.update({ facing: isLeft ? "EAST" : "WEST" });
        break;
      case "WEST":
        this.update({ facing: isLeft ? "SOUTH" : "NORTH" });
        break;
      case "EAST":
        this.update({ facing: isLeft ? "NORTH" : "SOUTH" });
        break;
    }
  }

  // Move 1 space in current facing direction
  move() {
    switch (this.facing) {
      case "NORTH":
        this.update({ y: this.y + 1 });
        break;
      case "SOUTH":
        this.update({ y: this.y - 1 });
        break;
      case "WEST":
        this.update({ x: this.x - 1 });
        break;
      case "EAST":
        this.update({ x: this.x + 1 });
        break;
    }
  }

  collition() {
    return (
      this.x < 0 ||
      this.x > maxColumns - 1 ||
      this.y < 0 ||
      this.y > maxRows - 1
    );
  }
}
