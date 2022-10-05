const SIZE = 4;
let Grid;
let score = 0;

$(document).ready(function () {
  setUpGrid();
});

function setUpGrid() {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      let $cell = $("<div>", { class: "cell", id: "cell-" + i + "-" + j });
      $(".Grid").append($cell);
      $("#cell-" + i + "-" + j).append($("<p>"));
    }
  }

  Grid = new Array(SIZE);

  for (let i = 0; i < SIZE; i++) {
    let j = 0;
    Grid[i] = new Array(SIZE).fill().map((u) => new Tile(i, j++));
  }
  newTile();
  newTile();
  display();
}

function newTile() {
  if (!emptyTile) {
    return;
  }
  let y = 0,
    x = 0;
  do {
    y = Math.floor(Math.random() * 4);
    x = Math.floor(Math.random() * 4);
  } while (Grid[y][x].value != 0);
  Grid[y][x].value = Math.random() > 0.25 ? 2 : 4;
}

function emptyTile() {
  for (let row of Grid) {
    for (let t of row) {
      if (t.value == 0) {
        return true;
      }
    }
  }
  return false;
}

$("#left").click(function () {
  play("LEFT");
});

$("#up").click(function () {
  play("UP");
});

$("#right").click(function () {
  play("RIGHT");
});

$("#down").click(function () {
  play("DOWN");
});

$(document).keydown(function (e) {
  console.log(e.which);
  switch (e.which) {
    case 39: // left
      play("LEFT");
      break;

    case 38: // up
      play("UP");
      break;

    case 37: // right
      play("RIGHT");
      break;

    case 40: // down
      play("DOWN");
      break;

    default:
      return;
  }
  e.preventDefault();
});

function play(dir) {
  if (move(dir)) {
    setTimeout(newTile(), 2000);
  }
  display();

  if (!noPossibleMove) {
    alert("Game Over");
  }
}

function move(dir) {
  let movedTile = false;
  for (let i = 0; i < SIZE; i++) {
    let tileSet = [];
    for (let j = 0; j < SIZE; j++) {
      switch (dir) {
        case "LEFT":
          tileSet.push(Grid[i][j]);
          break;
        case "RIGHT":
          tileSet.push(Grid[i][SIZE - j - 1]);
          break;
        case "UP":
          tileSet.push(Grid[j][i]);
          break;
        case "DOWN":
          tileSet.push(Grid[SIZE - j - 1][i]);
          break;
        default:
          break;
      }
    }

    if (!isEmptyTile(tileSet)) {
      movedTile = slide(tileSet);
    }
  }
  return movedTile;
}

function isEmptyTile(tileSet) {
  for (let t of tileSet) {
    if (t.value != 0) {
      return false;
    }
  }
  return true;
}

function slide(tileSet) {
  let moved = false;
  moved = moveZeros(tileSet);

  for (let i = 0; i < tileSet.length - 1; i++) {
    if (tileSet[i].value == tileSet[i + 1].value) {
      tileSet[i].value += tileSet[i + 1].value;
      addScore(tileSet[i].value);
      tileSet[i + 1].clear();
      let _ = moveZeros(tileSet);
      if (tileSet[i].value != 0) moved = true;
    }
  }

  return moved;
}

function moveZeros(tileSet) {
  let move = false;
  let count = 0;
  for (let i = 0; i < tileSet.length; i++) {
    if (tileSet[i].value !== 0) {
      tileSet[count++].value = tileSet[i].value;
    }
  }
  while (count < tileSet.length) {
    move = true;
    tileSet[count++].clear();
  }
  return move;
}

function noPossibleMove() {
  if (emptyTile()) {
    return false;
  }
  return !hasEqualNeighbour;
}

function hasEqualNeighbour() {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (j < SIZE - 1) {
        if (Grid[i][j].value == Grid[i][j + 1].value) {
          return true;
        }
      }
      if (i < SIZE - 1) {
        if ((Grid[i][j].value = Grid[i + 1][j].value)) {
          return true;
        }
      }
    }
  }
  return false;
}

function addScore(val) {
  score += val * 2;
  $("#score").text(score);
}

function display() {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      $("#cell-" + i + "-" + j + " p").text(Grid[i][j].value);
      $("#cell-" + i + "-" + j).addClass("active");
      if (Grid[i][j].value == 0) {
        $("#cell-" + i + "-" + j + " p").text(" ");
        $("#cell-" + i + "-" + j).removeClass("active");
      }
    }
  }
}
