var stage;
var shapes = [];
var slots = [];
var score = 0;

function init() {
    stage = new createjs.Stage("canvas");
    buildShapes();
    setShapes();
    startGame();
}

function buildShapes() {

    var key = 0,
        spanShapeJump = 1,
        spanSlotJump = 1,
        span = 140,
        minHeight = 140;

    circle = new createjs.Shape();
    circle.key = key++;
    square = new createjs.Shape();
    square.key = key++;
    elipse = new createjs.Shape();
    elipse.key = key++;
    triangle = new createjs.Shape();
    triangle.key = key++;

    key = 0;
    circleSlot = new createjs.Shape();
    circleSlot.key = key++;
    squareSlot = new createjs.Shape();
    squareSlot.key = key++;
    elipseSlot = new createjs.Shape();
    elipseSlot.key = key++;
    triangleSlot = new createjs.Shape();
    triangleSlot.key = key++;

    shapes.push(circle);
    shapes.push(square);
    shapes.push(elipse);
    shapes.push(triangle);

    slots.push(circleSlot);
    slots.push(squareSlot);
    slots.push(elipseSlot);
    slots.push(triangleSlot);

    // circle
    circle.graphics.beginFill('#0000FF').drawCircle(50, 50, 50);
    circleSlot.graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255, 1)).beginStroke('#0000FF').drawCircle(50, 50, 50);
    stage.addChild(circleSlot);

    // square
    square.graphics.beginFill('#FF0000').drawRect(0, 0, 100, 100);
    squareSlot.graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255, 1)).beginStroke('#FF0000').drawRect(0, 0, 100, 100);
    stage.addChild(squareSlot);

    // elipse
    elipse.graphics.beginFill('#00FF00').drawEllipse(0, 0, 120, 80);
    elipseSlot.graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255, 1)).beginStroke('#00FF00').drawEllipse(0, 0, 120, 80);
    stage.addChild(elipseSlot);

    // triangle
    triangle.graphics.beginFill('yellow');
    triangle.graphics.moveTo(50, 0).lineTo(0, 100).lineTo(100, 100).lineTo(50, 0);
    triangleSlot.graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255, 1)).beginStroke('yellow');
    triangleSlot.graphics.moveTo(50, 0).lineTo(0, 100).lineTo(100, 100).lineTo(50, 0);
    stage.addChild(triangleSlot);

    circle.regX = circle.regY = 50;
    square.regX = square.regY = 50;
    elipse.regX = elipse.regY = 50;
    triangle.regX = triangle.regY = 50;

    circleSlot.regX = circleSlot.regY = 50;
    squareSlot.regX = squareSlot.regY = 50;
    elipseSlot.regX = elipseSlot.regY = 50;
    triangleSlot.regX = triangleSlot.regY = 50;

    circle.y = minHeight;
    square.y = minHeight;
    elipse.y = minHeight;
    triangle.y = minHeight;
    circleSlot.y = minHeight;
    squareSlot.y = minHeight;
    elipseSlot.y = minHeight;
    triangleSlot.y = minHeight;

    circle.x = (spanShapeJump++) * span;
    square.x = (spanShapeJump++) * span;
    elipse.x = (spanShapeJump++) * span;
    triangle.x = (spanShapeJump++) * span;

    circleSlot.x = (spanSlotJump++) * span;
    squareSlot.x = (spanSlotJump++) * span;
    elipseSlot.x = (spanSlotJump++) * span;
    triangleSlot.x = (spanSlotJump++) * span;
}

function setShapes() {

    var i, r,
        shape1, shape2,
        l = shapes.length,
        _x;

    for (i = 0; i < l; i++) {
        r = Math.floor(Math.random() * shapes.length);
        shape1 = shapes[r];
        shape2 = shapes[(r + 1 >= shapes.length ? 0 : r + 1)];

        // swap
        _x = shape1.x;
        shape1.homeX = shape1.x = shape2.x;
        shape2.homeX = shape2.x = _x;

        shape1.homeY = shape1.y = shape1.y + 200;

        shape1.addEventListener("mousedown", startDrag);
        stage.addChild(shape1);
        shapes.splice(r, 1);
    }
}

function startGame() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function (e) {
        stage.update();
    });
}

function startDrag(e) {

    var shape = e.target;
    var slot = slots[shape.key];

    stage.setChildIndex(shape, stage.getNumChildren() - 1);

    stage.addEventListener('stagemousemove', function (e) {
        shape.x = e.stageX;
        shape.y = e.stageY;
    });

    stage.addEventListener('stagemouseup', function (e) {

        stage.removeAllEventListeners();
        var pt = slot.globalToLocal(stage.mouseX, stage.mouseY);
        if (slot.hitTest(pt.x, pt.y)) {
            shape.removeEventListener("mousedown", startDrag);
            score++;
            createjs.Tween.get(shape).to({
                x: slot.x,
                y: slot.y
            }, 200, createjs.Ease.quadOut).call(checkGame);
        } else {
            createjs.Tween.get(shape).to({
                x: shape.homeX,
                y: shape.homeY
            }, 200, createjs.Ease.quadOut);
        }
    });
}

function checkGame() {
    if (score == 4) {
        alert('You Win!');
    }
}