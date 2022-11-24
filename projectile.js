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

console.log("projectile");
console.log(xMap, yMap);

export default class Projectile {
  constructor(board) {
    this.board = board;
    this.projectileElem = document.createElement("img");
    this.x;
    this.y;
    this.facing = "North";
    this.explosion = false;
  }

  draw() {
    if (!this.explosion)
      replaceImg(this.projectileElem, `img/projectile${this.facing}.png`);

    this.projectileElem.style.gridRowStart = yMap.get(Number(this.y));
    this.projectileElem.style.gridColumnStart = xMap.get(Number(this.x));
    this.projectileElem.classList.add("projectile");
    this.board.appendChild(this.projectileElem);
  }

  update(options) {
    this.x = options.x == null ? this.x : Number(options.x);
    this.y = options.y == null ? this.y : Number(options.y);
    this.facing = options.facing == null ? this.facing : options.facing;
    this.draw();
  }

  // This is not ideal - should rather use promises
  shoot(pos1, pos2) {
    this.projectileElem.style.display = "block";
    setTimeout(() => {
      this.update(pos1);
      setTimeout(() => {
        this.update(pos2);
        setTimeout(() => {
          this.explosion = true;
          replaceImg(this.projectileElem, `img/explosion${this.facing}.png`);
          setTimeout(() => {
            this.explosion = false;
            this.projectileElem.style.display = "none";
          }, "500");
        }, "500");
      }, "500");
    }, "500");
  }

  // Attack 2 spaces in current facing direction
  attack() {
    switch (this.facing) {
      case "NORTH":
        this.shoot({ y: this.y + 1 }, { y: this.y + 2 });
        break;
      case "SOUTH":
        this.shoot({ y: this.y - 1 }, { y: this.y - 2 });
        break;
      case "WEST":
        this.shoot({ x: this.x - 1 }, { x: this.x - 2 });
        break;
      case "EAST":
        this.shoot({ x: this.x + 1 }, { x: this.x + 2 });
        break;
    }
  }

  collition() {
    console.log(this.y);
    return (
      this.x <= 1 ||
      this.x >= maxColumns - 2 ||
      this.y <= 1 ||
      this.y >= maxRows - 2
    );
  }
}
