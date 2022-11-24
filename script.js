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
let lastTime = null;

function gameLoop(time) {
  // Prevents first delta to have huge number
  if (lastTime != null) {
    let delta = time - lastTime;
    drone.draw();
    projectile.draw();
  }

  lastTime = time;
  requestAnimationFrame(gameLoop);
}

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
    gameLoop();
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
  }
}

commandListLinks.addEventListener("click", function (e) {
  const element = e.target.closest("li");
  if (element === null) return;

  if (element.classList[0] === "commandButton") {
    const command = element.innerText.toUpperCase();
    if (command === "PLACE") {
      commandListRun(command, "0,0,NORTH");
    } else {
      commandListRun(command);
    }
  }
});
