const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector(".score");

let timerId;
let xDirection = 2;
let yDirection = 2;
let score = 0;
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;

const userStart = [230, 10];
let currentUserPosition = userStart;

const ballStart = [270, 30];
let currentBallPosition = ballStart;

// create block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

// all blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

console.log(blocks[0]);

// draw block
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}

addBlocks();

// add user
const user = document.createElement("div");
user.classList.add("user");
drawUser();
user.style.left = grid.appendChild(user);

// draw user
function drawUser() {
  user.style.left = currentUserPosition[0] + "px";
  user.style.bottom = currentUserPosition[1] + "px";
}

// move user
function moveUser(event) {
  switch (event.key) {
    case "ArrowLeft":
      if (currentUserPosition[0] > 0) {
        currentUserPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentUserPosition[0] < boardWidth - blockWidth) {
        currentUserPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);

// add ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

// draw ball
function drawBall() {
  ball.style.left = currentBallPosition[0] + "px";
  ball.style.bottom = currentBallPosition[1] + "px";
}

// move ball
function moveBall() {
  currentBallPosition[0] += xDirection;
  currentBallPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}

// check for collisions
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}

function checkForCollisions() {
  // block collision
  for (let i = 0; i < blocks.length; i++) {
    if (
      currentBallPosition[0] + ballDiameter > blocks[i].bottomLeft[0] &&
      currentBallPosition[0] < blocks[i].bottomRight[0] &&
      currentBallPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      currentBallPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBLocks = Array.from(document.querySelectorAll(".block"));
      allBLocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score += 1000000;
      scoreDisplay.innerHTML = score;

      // check for win
      if (blocks.length === 0) {
        scoreDisplay.innerHTML = `YOU WIN! 🎉 </br><small>Score: ${score}</small>`;
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  //user collisions
  if (
    currentBallPosition[0] > currentUserPosition[0] &&
    currentBallPosition[0] < currentUserPosition[0] + blockWidth &&
    currentBallPosition[1] > currentUserPosition[1] &&
    currentBallPosition[1] < currentUserPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  // wall collisions
  if (
    currentBallPosition[0] >= boardWidth - ballDiameter ||
    currentBallPosition[1] >= boardHeight - ballDiameter ||
    currentBallPosition[0] <= 0
  ) {
    changeDirection();
  }

  // game over
  if (currentBallPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = `You lose. 😔 </br><small>Score: ${score}</small> `;
    document.removeEventListener("keydown", moveUser);
  }
}

// reset button
function startGame() {
  timerId = setInterval(moveBall, 30);
}

clearInterval(timerId);
const button = document.querySelector(".play");
button.addEventListener("click", startGame);
