var canvas;
var context;
var image;

var gameSize;
var gridSize;
var tileSize;

var boardParts={};

var solved;

var clickLoc={x:0,y:0};
var emptyLoc = { x: 0, y: 0 };

var music;


function setImage(imagePath){
  image=new Image();
  image.src=imagePath;
  image.addEventListener('load',drawTiles,false);

}

function drawTiles(){
  //context.drawImage(image,0,0);
  context.clearRect(0,0,gameSize,gameSize);
  for(var i=0;i<gridSize;++i){
    for(var j=0;j<gridSize;++j){
      var x=boardParts[i][j].x;
      var y=boardParts[i][j].y;
      if(i != emptyLoc.x || j != emptyLoc.y || solved === true) {
        context.drawImage(image, x*tileSize,y*tileSize, tileSize, tileSize,i*tileSize,j*tileSize,tileSize,tileSize);
      }
    }
  }
}

function distance(x1,y1,x2,y2){

  return Math.abs(x1-x2)+Math.abs(y1-y2);
}

function addEvents(canvas){

  canvas.onclick=function(){
    clickLoc.x=Math.floor((event.pageX-this.offsetLeft)/tileSize);
    clickLoc.y=Math.floor((event.pageY-this.offsetTop)/tileSize);

    if(distance(clickLoc.x,clickLoc.y,emptyLoc.x,emptyLoc.y) === 1){
      slideTile(emptyLoc, clickLoc);
      drawTiles();
    }
    if(solved){
      setTimeout(function(){ alert('You solved it!');}, 500);
    }


  };

}


function setBoard(){
  boardParts=new Array(gridSize);
  for(var i=0;i<gridSize;++i){
    boardParts[i]=new Array(gridSize);
    for(var j=0;j<gridSize;++j){
      boardParts[i][j]={
        x:(gridSize-1)-i,
        y:(gridSize-1)-j
      };
    }
  }
  
  emptyLoc.x = boardParts[gridSize - 1][gridSize - 1].x;
  emptyLoc.y = boardParts[gridSize - 1][gridSize - 1].y;
  solved=false;
}

function slideTile(toLoc, fromLoc){
    if (!solved) {
        boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
        boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
        boardParts[fromLoc.x][fromLoc.y].x = gridSize - 1;
        boardParts[fromLoc.x][fromLoc.y].y = gridSize - 1;
        toLoc.x = fromLoc.x;
        toLoc.y = fromLoc.y;
        checkSolved();
    }
}

function checkSolved() {
    var flag = true;
    for (var i = 0; i < gridSize; ++i) {
        for (var j = 0; j < gridSize; ++j) {
            if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
                flag = false;
            }
        }

    }

    solved = flag;
}


function playMusic(musicPath,filename) {
    music = new Audio();
    var soundStub = musicPath + "/" + filename;
    if (music.canPlayType('audio/ogg')) {
        music = new Audio(soundStub + '.ogg');
    } else if (music.canPlayType('audio/mp3')) {
        music = new Audio(soundStub + '.mp3');
    } else if (music.canPlayType('audio/m4a')) {
        music = new Audio(soundStub + '.m4a');
    }
    music.load();
    music.play();


}

function init(canvasId,imagePath,gridCount){
  canvas=document.getElementById(canvasId);
  context=canvas.getContext('2d');
  setImage(imagePath);

  gameSize=canvas.width;
  gridSize=gridCount;
  tileSize=gameSize/gridSize;

  addEvents(canvas);
  solved=false;
  setBoard();

}

function startGame(){
  init('game','images/island.jpg',3);
  playMusic('sounds','Recording'); 
}