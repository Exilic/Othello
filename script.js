let goodAttempt = false;
let playColor = "white";
let colorsWhite = 0;
let colorsBlack = 0;

const makeSvgElement = (kind) => document.createElementNS("http://www.w3.org/2000/svg", kind);

const square = (gridID) => document.getElementById(gridID);

function countColors() {
  colorsWhite = 0;
  colorsBlack = 0;
  for (let yCount = 1; yCount < 9; yCount++) {
    for (let xCount = 1; xCount < 9; xCount++) {
      let squareColor = getCurrentColor("y" + yCount + "x" + xCount);
      if (squareColor == "white") {
        colorsWhite++;
      } else if (squareColor == "black") {
        colorsBlack++;
      }
    }
  }
}

function flipTurn() {
  if (playColor == "white") {
    playColor = "black";
  } else {
    playColor = "white";
  }
}

function makeCircle(gridID) {
  let newCircle = makeSvgElement("circle");
  for (const [a, b] of [
    ["cx", "35"],
    ["cy", "35"],
    ["r", "28"],
    ["class", playColor],
  ])
    newCircle.setAttribute(a, b);
  square(gridID).appendChild(newCircle);
}

function changeColor(gridID) {
  let targetCircle = square(gridID).lastElementChild;
  let targetColor = targetCircle.getAttribute("class");
  if (targetColor == "white") {
    targetCircle.setAttribute("class", "black");
  } else {
    targetCircle.setAttribute("class", "white");
  }
}

const getCurrentColor = (gridID) => square(gridID).lastElementChild.getAttribute("class");

// Determines if the next brick is an opposite color to the one of the clicked square (can be several steps away)
function oppositeColor(yNeighbour, xNeighbour) {
  let gridID = "y" + yNeighbour + "x" + xNeighbour;
  let currentColor = getCurrentColor(gridID);
  if (currentColor != playColor) {
    return true;
  } else {
    return false;
  }
}

function emptyOrNot(gridID) {
  let squareClicked = square(gridID).children.length;
  if (squareClicked == 1) {
    return true;
  } else {
    return false;
  }
}

// Service function for discarding potential neighbouring squares that actually fall ourside the gamearea
function outOfArea(yNeighbour, xNeighbour) {
  if (yNeighbour == 0 || yNeighbour == 9 || xNeighbour == 0 || xNeighbour == 9) {
    return true;
  } else {
    return false;
  }
}

// Has all the logic for checking the consequences if a brick is set on the square clicked
// Consequences can be found in eight directions, based on the horizontal, vertical and diagonal vectors
function coreMechanics(yIndex, xIndex, y, x) {
  let yNext = y + yIndex;
  let xNext = x + xIndex;
  let stillChecking = true;
  let possibleCircles = [];
  let positiveCount = 0;
  while (stillChecking) {
    let possibleID = "y" + yNext + "x" + xNext;
    if (outOfArea(yNext, xNext) || emptyOrNot(possibleID)) {
      stillChecking = false;
    } else {
      if (oppositeColor(yNext, xNext)) {
        possibleCircles[positiveCount] = possibleID;
        positiveCount++;
        yNext += yIndex;
        xNext += xIndex;
      } else {
        for (let index = 0; index < positiveCount; index++) {
          let changeID = possibleCircles[index];
          changeColor(changeID);
        }
        if (positiveCount > 0) {
          goodAttempt = true;
        }
        stillChecking = false;
      }
    }
  }
}

// Checks the square clicked and performs a full turn, if the square is an appropriate one
function attemptedMove(gridID) {
  goodAttempt = false;
  if (emptyOrNot(gridID)) {
    var y = parseInt(String(gridID).charAt(1));
    var x = parseInt(String(gridID).charAt(3));

    for (let yIndex = -1; yIndex < 2; yIndex += 2) {
      for (let xIndex = -1; xIndex < 2; xIndex++) {
        coreMechanics(yIndex, xIndex, y, x);
      }
    }
    for (let xIndex = -1; xIndex < 2; xIndex += 2) {
      let yIndex = 0;
      coreMechanics(yIndex, xIndex, y, x);
    }
    if (goodAttempt) {
      makeCircle(gridID);
      flipTurn();
      countColors();
      console.log(colorsBlack, colorsWhite);
    }
  }
}

// Lets the current player indicate where to put a new brick
document.getElementById("gameArea").addEventListener("click", (e) => {
  attemptedMove(e.path[1].getAttribute("id"));
});

// Sets the static circumstances for beginning the game
window.addEventListener("load", (e) => {
  for (let yCount = 1; yCount < 9; yCount++) {
    for (let xCount = 1; xCount < 9; xCount++) {
      let newSVG = makeSvgElement("svg");
      for (const [a, b] of [
        ["width", "70"],
        ["height", "70"],
        ["id", "y" + yCount + "x" + xCount],
      ])
        newSVG.setAttribute(a, b);
      document.getElementById("gameArea").appendChild(newSVG);

      let newRect = makeSvgElement("rect");
      for (const [c, d] of [
        ["width", "70"],
        ["height", "70"],
      ])
        newRect.setAttribute(c, d);
      newSVG.appendChild(newRect);
    }
  }
  ["y4x4", "y5x5"].forEach(makeCircle);
  flipTurn();
  ["y4x5", "y5x4"].forEach(makeCircle);
  flipTurn();
});
