// createjs
var canvas, stage, queue, padel, cards;

function init() {
  canvas = document.getElementById('canvas');
  stage = new createjs.Stage(canvas);
  cards = [];
  createjs.Ticker.setFPS(60);
  createjs.Ticker.on('tick', stage);
  preload();
  // initGame();
}

function preload() {
  queue = new createjs.LoadQueue();
  queue.addEventListener('complete', initGame);
  queue.loadManifest([
    { id: "back", src: "img/back.png" },
  ]);
}

function initGame() {
  padel = new createjs.Shape();
  padel.graphics
    .setStrokeStyle(1)
    .beginStroke('#000')
    .drawRect(0, 0, 640, 480);
  stage.addChild(padel);

  createCards();
  placeCards();

  //handle keys
  // window.onkeydown = movePadel;
  // window.onkeyup = stopPadel;
}

function createCards() {

  var i = 0;

  for (i = 52; i >= 0; i--) {

    var card = createCard(i);
    stage.addChild(card);
    cards.push(card);
  }
}

function placeCards() {

  var col, i, card, hiddenCards, visibleCards = 1;

  for (col = 0; col < 7; col++) {

    card = cards[i];

    card.x = i * 10;
    card.y = i * 20;

    hiddenCards = col;
    visibleCards++;
  }


  // for (i = 0; i < 5; i++) {
  //   stage.setChildIndex(card, stage.getNumChildren() - 1);
  // }
}

function createCard(index) {

  var card = new createjs.Container(),
    bmp = new createjs.Bitmap(queue.getResult('back'));
  bmp.name = 'back';
  bmp.scaleX = bmp.scaleY = 0.4;

  card.addChild(bmp);
  // card.addEventListener('click', flipCard);
  // card1.regX = bmp.image.width / 2;
  // card1.regY = bmp.image.height / 2;
  // bmp.regX = bmp.image.width / 2;
  // bmp.regY = bmp.image.height / 2;

  // card.x = 10;
  // card.y = 10;

  return card;
}

function flipCard(e) {
  if (cardsFlipped.length === 2) {
    return;
  }
  var card = e.currentTarget;
  card.mouseEnabled = false;
  card.getChildByName('back').visible = false;
  cardsFlipped.push(card);
  if (cardsFlipped.length === 2) {
    evalCardsFlipped();
  }
}