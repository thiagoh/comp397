(function() {
  'use script';

  var stage,
    colors = ['#cc4444', '#4444cc'],
    width,
    height,
    player = colors[0],
    map = [];

  var init = function init(canvasId) {

    canvasEl = document.getElementById(canvasId);

    width = canvasEl.width;
    height = canvasEl.height;
    stage = new createjs.Stage(canvasEl);

    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);
    start();
  };

  function handleTick(e) {
    stage.update();
  }

  function start() {
    drawGrid();
    drawCircles();
  }

  function drawGrid(clickHandler) {
    var square;
    for (var x = 0; x < 7; x++) {
      for (var y = 0; y < 7; y++) {
        square = new createjs.Shape();
        square.graphics.beginStroke('#555');
        square.graphics.beginFill('white');
        square.graphics.drawRect(0, 0, (width / 7), (height / 7));
        square.x = x * (width / 7);
        square.y = y * (height / 7);
        stage.addChild(square);
      }
    }

    for (var row = 0; row < 6; row++) {
      map[row] = [];

      for (var col = 0; col < 7; col++) {
        map[row][col] = 0;
      }
    }

    stage.update();
  }

  function drawCircle(color, x, y, clickHandler) {
    var circle = new createjs.Shape();
    circle.graphics.beginStroke('#555');
    circle.graphics.beginFill(color);
    circle.graphics.drawCircle(0, 0, 40);
    circle.x = (x * (width / 7)) + 57; // center X of grid square 
    circle.y = (y * (height / 7)) + 43; // center Y of grid square
    circle.gameRow = y;
    circle.gameCol = x;
    circle.gamePlayer = player;

    if (clickHandler) {
      circle.addEventListener("click", clickHandler);
    }
    stage.addChild(circle);

    return circle;
  }

  function diskClick(e) {
    if (checkTie()) {
      $('#result').html('Tie game');
      return;
    }

    if (checkMove(e.target)) {
      animate(e.target);

      if (checkWin()) {
        $('#result').html('Congrats, you Win!');
        return;
      }

      if (player === colors[0]) {
        player = colors[1];
      } else {
        player = colors[0];
      }

      drawCircles();
    }
  }

  var drawCircles = function drawCircles() {
    drawCircle(player, 0, 0, diskClick);
    drawCircle(player, 1, 0, diskClick);
    drawCircle(player, 2, 0, diskClick);
    drawCircle(player, 3, 0, diskClick);
    drawCircle(player, 4, 0, diskClick);
    drawCircle(player, 5, 0, diskClick);
    drawCircle(player, 6, 0, diskClick);
  }

  function checkMove(circle) {
    if (checkTie() || checkWin())
      return false;

    var destRow = -1;
    for (var i = 5; i >= 0; i--) {
      if (map[i][circle.gameCol] == 0) {
        destRow = i;
        circle.gameRow = destRow;
        map[i][circle.gameCol] = player;
        break;
      }
    }

    if (destRow > -1)
      return true;
    else
      return false;
  }

  function animate(circle) {
    createjs.Tween.get(circle).to({ y: (((circle.gameRow + 1) * (height / 7)) + 43) }, 1000);
  }

  function checkTie() {
    var existEmptyCell = false;
    for (var col = 0; col < 7; col++) {
      for (var row = 0; row < 6; row++) {
        if (map[row][col] == 0)
          existEmptyCell = true;
      }
    }

    return existEmptyCell === false;
  }

  function checkWin() {
    var score = 0,
      col = 0,
      row = 0;

    //check for vertical winner
    for (col = 0; col < 7; col++) {
      for (row = 0; row < 6; row++) {
        if (map[row][col] === player) {
          score++;
        }

        if (score === 4) {
          return true;
        }
      }
      score = 0;
    }

    score = 0;

    //check for horizontal winner
    for (row = 0; row < 6; row++) {
      for (col = 0; col < 7; col++) {
        if (map[row][col] === player) {
          score++;
        }

        if (score === 4) {
          return true;
        }
      }
      score = 0;
    }

    return false;
  }

  window.init = init;

})();