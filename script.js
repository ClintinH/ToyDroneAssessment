import Drone from "./drone.js";
import Projectile from "./projectile.js";

const board = document.getElementById("board");
const commandList = document.querySelector(".commandListText");
const commandListLinks = document.querySelector(".flexbox-left");
const outputBox = document.querySelector(".outputDisplay");

const submitButton = document.querySelector(".submit-button");
const inputField = document.querySelector(".input-field");

const drone = new Drone(board);
const projectile = new Projectile(board);

let commandInput = true;

// setting the command list and buttonstyles
commandList.innerHTML = `
    <h5 class="commandList__header">Commands</h5>
        <ul class="commandList">
            <li class="commandButton linkstyle">Place</li>
            <li class="commandButton linkstyle">Move</li>
            <li class="commandButton linkstyle">Left</li>
            <li class="commandButton linkstyle">Right</li>
            <li class="commandButton linkstyle">Attack</li>
            <li class="commandButton linkstyle">Report</li>
        </ul>
 `;

outputBox.innerHTML = `
    <h5 class="output__header">Output</h5>
        <div class="display_output"></div>
 `;

submitButton.addEventListener("click", function () {
  const inputValue = inputField.value.toUpperCase();
  if (inputValue.includes("PLACE") || inputValue.includes("ATTACK")) {
    const [command, options] = inputValue.split(" ");
    commandListRun(command, options);
  } else {
    commandListRun(inputValue);
  }

  inputField.value = "";
});

function notPlaced(input) {
  // check if placed command was entered
  if (input === "PLACE") {
    commandInput = false;
  }
}

export function outputText(text) {
  const displayOutput = document.querySelector(".display_output");
  displayOutput.innerHTML += text + "</br>";
}

function commandListRun(command, options) {
  //should be falsy value
  notPlaced(command);
  if (commandInput) {
    outputText(`Error - Place command should be completed first`);
  } else {
    switch (command) {
      case "PLACE":
        if (drone.collition())
          return outputText(`Collition - Cannot complete ${command}`);
        const [x, y, facing] = options.split(",");
        drone.update({ x, y, facing });
        projectile.update({ x: drone.x, y: drone.y, facing: drone.facing });
        break;
      case "MOVE":
        if (drone.collition())
          return outputText(`Collition - Cannot complete ${command}`);
        drone.move();
        projectile.update({ x: drone.x, y: drone.y, facing: drone.facing });
        outputText(`${command} Drone move 1 space forward`);
        // drone.draw();
        break;
      case "LEFT":
        outputText(`${command} Drone turn left`);
        drone.left();
        projectile.update({ x: drone.x, y: drone.y, facing: drone.facing });
        // drone.draw();
        break;
      case "RIGHT":
        outputText(`${command} Drone turn Right`);
        drone.right();
        projectile.update({ x: drone.x, y: drone.y, facing: drone.facing });
        // drone.draw();
        break;
      case "ATTACK":
        if (projectile.collition())
          return outputText(`Collition - Cannot complete ${command}`);
        projectile.attack();
        break;
      case "REPORT":
        outputText(`${command} ${drone.x},${drone.y},${drone.facing}`);
        break;
    }
    drone.draw();
    projectile.draw();
  }
}

commandListLinks.addEventListener("click", function (e) {
  const element = e.target.closest("li");
  if (element === null) return;

  if (element.classList[0] === "commandButton") {
    const command = element.innerText.toUpperCase();
    if (command === "PLACE") {
      commandListRun(command, "5,5,NORTH");
    } else {
      commandListRun(command);
    }
  }
});

let images = [
  "droneEAST.png",
  "droneNORTH.png",
  "droneSOUTH.png",
  "droneWEST.png",
  "explosionEAST.png",
  "explosionNORTH.png",
  "explosionSOUTH.png",
  "explosionWEST.png",
  "projectileEAST.png",
  "projectileNORTH.png",
  "projectileSOUTH.png",
  "projectileWEST.png",
];

///loader
let bar_percentage = document.getElementById("bar_percentage");
let percentage_number = document.getElementById("percentage_number");
let loaderOverlay = document.getElementById("loaderOverlay");

let img_queue = new createjs.LoadQueue();
let completedProgress = 0;
img_queue.addEventListener("progress", (event) => {
  let progress_percentage = Math.floor(event.progress * 100);
  bar_percentage.style.width = progress_percentage + "%";
  percentage_number.innerHTML = progress_percentage + "%";
  console.log("progress " + Math.floor(event.progress * 100));
  if (progress_percentage === 100) preloaderComplete();
});

images.forEach((element) => {
  img_queue.loadFile(`img/${element}`);
});

function preloaderComplete() {
  loaderOverlay.remove();
}

let loadedImages = new Map();

img_queue.addEventListener("fileload", (e) => {
  addImg(e.item.id, e.loader._rawResult);
});

export function replaceImg(element, id) {
  let urlCreator = window.URL || window.webkitURL;
  let imageUrl = urlCreator.createObjectURL(loadedImages.get(id));
  element.src = imageUrl;
}

function addImg(id, loadedImg) {
  if (!loadedImages.has(id)) {
    loadedImages.set(id, loadedImg);
  }
}
