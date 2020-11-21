var gameArea = document.getElementById("gameArea");
for (let yCount = 1; yCount < 9; yCount++) {
  for (let xCount = 1; xCount < 9; xCount++) {
    let newSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSVG.setAttribute("width", "70");
    newSVG.setAttribute("height", "70");
    newSVG.setAttribute("id", "y" + yCount + "x" + xCount);
    gameArea.appendChild(newSVG);
    let newRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    newRect.setAttribute("width", "70");
    newRect.setAttribute("height", "70");
    newSVG.appendChild(newRect);
  }
}

var goodAttempt = false;
var playColor = "white";

makeCircle("y4x4");
makeCircle("y5x5");
flipTurn();
makeCircle("y4x5");
makeCircle("y5x4");

function flipTurn() {
  if (playColor == "white") {
    playColor = "black";
  } else {
    playColor = "white";
  }
}

function makeCircle(gridID) {
  let newCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  newCircle.setAttribute("cx", "35");
  newCircle.setAttribute("cy", "35");
  newCircle.setAttribute("r", "28");
  newCircle.setAttribute("class", playColor);
  document.getElementById(gridID).appendChild(newCircle);
}

function emptyOrNot(element) {
  let squareClicked = document.getElementById(element).children.length;
  if (squareClicked == 1) {
    return true;
  } else {
    return false;
  }
}

function attemptedMove(element) {
  goodAttempt = false;
  if (emptyOrNot(element)) {
    var y = parseInt(String(element).charAt(1));
    var x = parseInt(String(element).charAt(3));

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
      makeCircle(element);
      flipTurn();
    }
  }
}

function coreMechanics(yIndex, xIndex, y, x) {
  let yNext = y + yIndex;
  let xNext = x + xIndex;
  let stillChecking = true;
  let possibleCircles = [];
  let positiveCount = 0;
  while (stillChecking) {
    let possibleID = "y" + yNext + "x" + xNext;
    console.log(possibleID);
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

function outOfArea(yNeighbour, xNeighbour) {
  if (
    yNeighbour == 0 ||
    yNeighbour == 9 ||
    xNeighbour == 0 ||
    xNeighbour == 9
  ) {
    return true;
  } else {
    return false;
  }
}

function oppositeColor(yNeighbour, xNeighbour) {
  let nextID = "y" + yNeighbour + "x" + xNeighbour;
  let colorTarget = document.getElementById(nextID).lastElementChild;
  let currentColor = colorTarget.getAttribute("class");
  if (currentColor != playColor) {
    return true;
  } else {
    return false;
  }
}

function changeColor(gridID) {
  let targetSVG = document.getElementById(gridID);
  let targetCircle = targetSVG.lastElementChild;
  let targetColor = targetCircle.getAttribute("class");
  if (targetColor == "white") {
    targetCircle.setAttribute("class", "black");
  } else {
    targetCircle.setAttribute("class", "white");
  }
}

let myTarget = document.getElementById("gameArea");
myTarget.addEventListener("click", function (e) {
  attemptedMove(e.path[1].getAttribute("id"));
});
