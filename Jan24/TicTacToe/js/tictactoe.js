(function() {
  'use strict';

  /** Variables Declarations **/

  // get canvas element
  var canvas;

  // get the 2d context out of canvas element
  var context;

  // get width, height of canvas element
  var width;
  var height;

  var xBoard = 0;
  var oBoard = 0;

  var score = {
    win: 0,
    lost: 0,
    tie: 0
  };

  function drawBoard() {
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 4;

    var vl1 = Math.round(width / 3);
    var vl2 = Math.round(vl1 * 2);
    var hl1 = Math.round(height / 3);
    var hl2 = Math.round(hl1 * 2);

    // draw first vertical line
    context.moveTo(vl1, 0);
    context.lineTo(vl1, height);

    // draw second vertical line
    context.moveTo(vl2, 0);
    context.lineTo(vl2, height);

    // draw first horizontal line
    context.moveTo(0, hl1);
    context.lineTo(width, hl1);

    // draw second horizontal line
    context.moveTo(0, hl2);
    context.lineTo(width, hl2);

    context.stroke();
    context.closePath();

  }

  // draws an X on the board
  function drawX(x, y) {
    context.beginPath();
    context.strokeStyle = '#ff0000';
    context.lineWidth = 4;

    var ox = (width / 3) * .1;
    var oy = (height / 3) * .1;

    var beginX = ox + x * (width / 3);
    var endX = -ox + (x + 1) * (width / 3);

    var beginY = oy + y * (height / 3);
    var endY = -oy + (y + 1) * (height / 3);

    context.moveTo(beginX, beginY);
    context.lineTo(endX, endY);

    context.moveTo(beginX, endY);
    context.lineTo(endX, beginY);

    context.stroke();
    context.closePath();
  }

  // draws an O on the board
  function drawO(x, y) {
    context.beginPath();
    context.strokeStyle = '#0000ff';
    context.lineWidth = 10;

    var ox = (width / 3) * .1;
    var oy = (height / 3) * .1;


    var beginX = ox + x * (width / 3);
    var endX = -ox + (x + 1) * (width / 3);

    var beginY = oy + y * (height / 3);
    var endY = -oy + (y + 1) * (height / 3);

    var rx = (endX - beginX - ox) / 2;
    var ry = (endY - beginY - oy) / 2;
    var r = (rx > ry) ? ry : rx;

    context.arc(
      beginX + (endX - beginX) / 2,
      beginY + (endY - beginY) / 2,
      r,
      0,
      Math.PI * 2,
      true
    );

    context.stroke();
    context.closePath();
  }

  function isEmpty(xBoard, oBoard, bit) {
    return (((xBoard & bit) == 0) && ((oBoard & bit) == 0));
  }

  function markBit(markBit, player) {
    var bit = 1;
    var x = 0;
    var y = 0;

    while ((markBit & bit) == 0) {
      bit = bit << 1;
      x++;
      if (x > 2) {
        x = 0;
        y++;
      }
    }
    if (player === 'O') {
      oBoard = oBoard | bit;
      drawO(x, y);
    } else {
      xBoard = xBoard | bit;
      drawX(x, y);
    }
  }


  function clickHandler(event) {
    var x = Math.floor((event.clientX - canvas.offsetLeft) / (width / 3));
    var y = Math.floor((event.clientY - canvas.offsetTop) / (height / 3));

    var bit = (1 << x + (y * 3));

    if (isEmpty(xBoard, oBoard, bit)) {
      markBit(bit, 'X');
      if (!checkTie()) {
        if (checkWinner(xBoard)) {
          alert('You Win!');
          score.win++;
          restart();
        } else {
          play();
          if (!checkTie()) {
            if (checkWinner(oBoard)) {
              alert('You Lost!');
              score.lost++;
              restart();
            }
          } else {
            score.tie++;
          }

        }
      } else {
        score.tie++;
      }

    } else {
      //alert('cell occupied');
    }
  }

  function incrementScores() {
    document.getElementById('wins').innerHTML = score.win;
    document.getElementById('losses').innerHTML = score.lost;
    document.getElementById('ties').innerHTML = score.tie;

  }

  function checkWinner(board) {
    var winState = false;
    if (
      ((board | 0x1C0) === board) ||
      ((board | 0x38) === board) ||
      ((board | 0x7) === board) ||
      ((board | 0x124) === board) ||
      ((board | 0x92) === board) ||
      ((board | 0x49) === board) ||
      ((board | 0x111) === board) ||
      ((board | 0x54) === board)
    ) {
      winState = true;
    }
    return winState;
  }

  function calculateRatio(oBoard, xBoard, player, bit, ratio) {
    var best;
    if (player === 'O') {
      oBoard = oBoard | bit;

    } else {
      xBoard = xBoard | bit;
    }

    if (checkWinner(oBoard)) {
      ratio *= 1.1;
      best = ratio;
    } else if (checkWinner(xBoard)) {
      ratio *= 0.7;
      best = ratio;
    } else {
      best = 0;
      ratio *= .6;
    }

    for (var i = 0; i < 9; i++) {
      if (isEmpty(xBoard, oBoard, 1 << i)) {
        var newPlayer = player == 'O' ? 'X' : 'O';
        var newRatio = calculateRatio(oBoard, xBoard, newPlayer, 1 << i, ratio);
        if (best === 0 || best < newRatio) {
          best = newRatio;
        }
      }
    }

    return best;
  }

  function simulate(oBoard, xBoard) {
    var ratio = 0;
    var bit = 0;

    for (var i = 0; i < 9; i++) {
      var checkBit = 1 << i;
      if (isEmpty(xBoard, oBoard, checkBit)) {
        if (checkWinner(oBoard | checkBit)) {
          bit = checkBit;
          break;
        } else if (checkWinner(xBoard | checkBit)) {
          bit = checkBit;
        }
      }
    }

    if (bit === 0) {
      for (var i = 0; i < 9; i++) {
        var checkBit = 1 << i;
        if (isEmpty(xBoard, oBoard, checkBit)) {
          var result = calculateRatio(oBoard, xBoard, 'X', 0, 1);
          if (ratio === 0 || ratio < result) {
            ratio = result;
            bit = checkBit;
          }
        }
      }

    }
    return bit;
  }


  function restart() {
    incrementScores();
    context.clearRect(0, 0, width, height);
    xBoard = 0;
    oBoard = 0;
    drawBoard();
  }

  function checkTie() {
    var tie = false;
    if ((xBoard | oBoard) === 0x1ff) {
      restart();
      tie = true;
      alert('Tie!');
    }

    return tie;
  }

  function play() {
    var bestPlay = simulate(oBoard, xBoard);
    markBit(bestPlay, 'O');
  }


  // Initializes the game by initializing global variables and drawing the board
  var init = function init(canvasID) {
    canvas = document.getElementById(canvasID);
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

    canvas.addEventListener('click', clickHandler);

    drawBoard();
  };

  window.init = init;

})();