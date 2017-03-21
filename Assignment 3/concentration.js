var stage, queue, canvas, menu, game;

var faces = ['jackal', 'ram', 'pig', 'mongoose', 'goat',
    'monkey', 'deer', 'cow', 'cat', 'donkey',
    'wolf', 'fox', 'dog', 'giraffe', 'yak',
    'camel', 'leopard', 'tiger', 'elephant', 'lion',
  ],
  cardsPerRow = 0,
  cards = [],
  cardsFlipped = [],
  matches = 0;

function preload() {
  queue = new createjs.LoadQueue();
  queue.addEventListener("complete", init);
  queue.loadManifest([
    { id: "shell", src: "img/card.png" },
    { id: "back", src: "img/back.png" },
    // { id: "garlic", src: "img/garlic.png" },
    // { id: "onion", src: "img/onion.png" },
    // { id: "pepper", src: "img/pepper.png" },
    // { id: "potato", src: "img/potato.png" },
    // { id: "spinach", src: "img/spinach.png" },
    // { id: "tomato", src: "img/tomato.png" },
    // { id: "green-apple", src: "img/green-apple.png" },
    // { id: "orange-pepper", src: "img/orange-pepper.png" },
    // { id: "orange", src: "img/orange.png" },
    // { id: "red-pepper", src: "img/red-pepper.png" },
    { id: 'jackal', src: 'img/jackal.png' },
    { id: 'ram', src: 'img/ram.png' },
    { id: 'pig', src: 'img/pig.png' },
    { id: 'mongoose', src: 'img/mongoose.png' },
    { id: 'goat', src: 'img/goat.png' },
    { id: 'monkey', src: 'img/monkey.png' },
    { id: 'deer', src: 'img/deer.png' },
    { id: 'cow', src: 'img/cow.png' },
    { id: 'cat', src: 'img/cat.png' },
    { id: 'donkey', src: 'img/donkey.png' },
    { id: 'wolf', src: 'img/wolf.png' },
    { id: 'fox', src: 'img/fox.png' },
    { id: 'dog', src: 'img/dog.png' },
    { id: 'giraffe', src: 'img/giraffe.png' },
    { id: 'yak', src: 'img/yak.png' },
    { id: 'camel', src: 'img/camel.png' },
    { id: 'leopard', src: 'img/leopard.png' },
    { id: 'tiger', src: 'img/tiger.png' },
    { id: 'elephant', src: 'img/elephant.png' },
    { id: 'lion', src: 'img/lion.png' },
  ]);
}

function getByClassName(classname) {
  return Array.prototype.slice.call(document.getElementsByClassName(classname));
}

function getById(id) {
  return document.getElementById(id);
}

function removeClass(el, classname) {
  el.className = el.className.replace(classname, '').trim();
  return el;
}

function addClass(el, classname) {
  el.className = (el.className + ' ' + classname).trim();
  return el;
}

function enableButtons() {

  getByClassName('start-button').forEach(function(item, b, c) {
    removeClass(item, 'disabled');
  });
}

function init() {

  canvas = getById('canvas');
  menu = getById('menu');
  game = getById('game');

  stage = new createjs.Stage(canvas);
  enableButtons();
}

function startGame(cardsPerRowArg) {

  cardsPerRow = cardsPerRowArg;
  start();
  buildCards();
  shuffleCards();
  dealCards();
}

function buildCards() {
  var i, card1, card2, bmp, label, face;

  console.log('cardsPerRow', cardsPerRow);

  for (i = 0; i < cardsPerRow * cardsPerRow / 2; i++) {

    card1 = new createjs.Container();
    bmp = new createjs.Bitmap(queue.getResult('shell'));
    bmp.shadow = new createjs.Shadow("#666", 3, 3, 5);
    card1.regX = bmp.image.width / 2;
    card1.regY = bmp.image.height / 2;
    card1.addChild(bmp);
    face = faces[i];
    bmp = new createjs.Bitmap(queue.getResult(face));
    bmp.regX = bmp.image.width / 2;
    bmp.regY = bmp.image.height / 2;
    bmp.scaleX = 0.5;
    bmp.x = card1.regX;
    bmp.y = 70;
    card1.addChild(bmp);
    label = new createjs.Text(faces[i].toUpperCase(), "12px Arial", "#009900");
    label.textAlign = 'center';
    label.x = card1.regX;
    label.y = 144;
    card1.addChild(label);

    bmp = new createjs.Bitmap(queue.getResult('back'));
    bmp.name = 'back';
    card1.addChild(bmp);
    card2 = card1.clone(true);
    card1.key = card2.key = faces[i];
    cards.push(card1, card2);
  }
}

function shuffleCards() {

  var i, card,
    randomIndex,
    l = cards.length,
    shuffledCards = [];

  for (i = 0; i < l; i++) {

    randomIndex = Math.floor(Math.random() * cards.length);
    shuffledCards.push(cards[randomIndex]);
    cards.splice(randomIndex, 1);
  }
  cards = cards.concat(shuffledCards);
}

function dealCards() {

  var i, card,
    xPos = 100,
    yPos = 100,
    count = 0;

  for (i = 0; i < cards.length; i++) {

    card = cards[i];
    card.x = -200;
    card.y = 400;
    card.rotation = Math.random() * 600;
    card.addEventListener('click', flipCard);

    stage.addChild(card);

    createjs.Tween.get(card)
      .wait(i * 100)
      .to({ x: xPos, y: yPos, rotation: 0 }, 300);

    xPos += 150;
    count++;

    if (count === cardsPerRow) {
      count = 0;
      xPos = 100;
      yPos += 220;
    }
  }
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

function evalCardsFlipped() {

  if (cardsFlipped[0].key === cardsFlipped[1].key) {
    matches++;
    evalGame();

  } else {
    setTimeout(resetFlippedCards, 1000);
  }
}

function resetFlippedCards() {
  cardsFlipped[0].mouseEnabled = cardsFlipped[1].mouseEnabled = true;
  cardsFlipped[0].getChildByName('back').visible = true;
  cardsFlipped[1].getChildByName('back').visible = true;
  cardsFlipped = [];
}

function evalGame() {
  if (matches === cardsPerRow * cardsPerRow / 2) {
    setTimeout(function() {
      alert('YOU WIN!');
    }, 300);
  } else {
    cardsFlipped = [];
  }
}

function start() {

  removeClass(game, 'hide');
  addClass(menu, 'hide');

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", function(e) {
    stage.update();
  });
}