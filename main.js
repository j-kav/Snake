/**
 * Created by j on 5/25/17.
 */


function SnakeNodePosition() {
    this.position = {
        x: 0,
        y: 0,
        direction: 'bottom'
    };

    this.lastPosition = {
        x: 0,
        y: 0,
        direction: 'bottom'
    }

}


function SnakeScene(options) {
    this.isPlaying = false;
    this.target = null;
    this.snake = null;
    this.pixelSize = 10;
    this.container = document.getElementById('scene');
    this.score = 0;
    this.scoreContainer = document.getElementById('score');
    this.stepLevel = 0;
    this.frame = null;
    this.speedIncreaseLevel = 1.3;
    this.speed = 100;
    this.mousePosition = {
        last: {
            x: 0,
            y: 0,
            direction: 'bottom'
        },
        direction: 'bottom'
    };
    this.debug = true;
    Object.assign(this, options);

    this.squareSize = this.pixelSize * 50;
    this.originalSquareSize = (this.squareSize + this.pixelSize);
    this.mouseMoveHandler = this.directionHandler;
    this.snakeHandler = this.snakeDirectionHandler;

}

SnakeScene.prototype.directionChanged = function(direction){
    this.snake.setDirection(direction);
};

SnakeScene.prototype.snakeDirectionHandler = function (event) {

    switch (event.keyCode) {
        case 40:
            this.directionChanged('bottom');
            break;
        case 38:
            this.directionChanged('top');
            break;
        case 37:
            this.directionChanged('left');
            break;
        case 39:
            this.directionChanged('right');
            break;
    }

    if (event.keyCode === 27) {
        if (this.isPlaying) {
            this.stopMove();
        } else {
            this.startMove();
        }
        this.isPlaying = !this.isPlaying;
    }

};


SnakeScene.prototype.directionHandler = function (event) {
    var direction = this.mousePosition.direction;
    var deltaX = this.mousePosition.last.x - event.clientX,
        deltaY = this.mousePosition.last.y - event.clientY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
        direction = 'left';
    } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
        direction = 'right';
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
        direction = 'top';
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
        direction = 'bottom';
    }

    this.mousePosition.x = event.clientX - this.container.offsetLeft;
    this.mousePosition.y = event.clientY - this.container.offsetTop;
    this.mousePosition.direction = direction;
    this.mousePosition.last = {
        x: event.clientX,
        y: event.clientY,
        direction: direction
    }

};

SnakeScene.prototype.initListeners = function () {
    this.container.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
    document.addEventListener('keydown', this.snakeHandler.bind(this));
};

SnakeScene.prototype.removeListeners = function () {
    this.container.removeEventListener('mousemove', this.mouseMoveHandler.bind(this));
    document.removeEventListener('keydown', this.snakeHandler.bind(this));
};

SnakeScene.prototype.increaseScore = function (factor) {
    this.score += this.pixelSize;
    this.score *= factor;
    this.score = Math.round(this.score);
    this.scoreContainer.innerText = this.score;
};

SnakeScene.prototype.add = function (element) {
    this.container.appendChild(element);
    return this;
};

SnakeScene.prototype.stopGame = function () {

    this.container.style.boxShadow = 'tomato 0px 0px 4px 3px';
    this.stopMove();
    this.removeListeners();
    if (this.score > (+localStorage.bestscore || 0)) {
        localStorage.bestscore = this.score;
    }
};

SnakeScene.prototype.initScene = function () {
    document.getElementById('bestScore').innerText = (+localStorage.bestscore | 0).toString();

    this.container.style.width = this.container.style.height = this.originalSquareSize + 'px';
    this.container.style.backgroundColor = '#99CC99';
    this.container.style.position = 'relative';

    this.initTarget();
    this.initSnake();
};

SnakeScene.prototype.initTarget = function () {
    var target = new Target(this.pixelSize);
    this.target = target;
    target.setPosition(this.getRandomPosition(), this.getRandomPosition());
    this.add(target.getTargetElement());
};

SnakeScene.prototype.initSnake = function () {
    this.snake = new Snake(this.pixelSize);
    var headNode = new SnakeNode(this.pixelSize);
    this.snake.head = headNode;
    this.add(headNode.getNodeElement());
    this.snake.head.setX(this.getCenterByX());
    this.snake.head.setY(0);
    this.snake.setDirection('bottom');
    this.snake.head.element.style.backgroundColor = 'black';
};

SnakeScene.prototype.shuffleTargetPosition = function () {
    var element = document.getElementById('target');
    this.target.setPosition(this.getRandomPosition(), this.getRandomPosition());
    this.container.replaceChild(this.target.getTargetElement(), element);
};

SnakeScene.prototype.isOverlapped = function (x, y) {
    var isOverlapped = false;
    if (x < 0 || x > this.squareSize) {
        isOverlapped = true;
    }
    if (y < 0 || y > this.squareSize) {
        isOverlapped = true;
    }

    return isOverlapped;
};


SnakeScene.prototype.start = function () {
    this.initScene();
    this.initListeners();
    this.startMove();

    this.isPlaying = true;
};


SnakeScene.prototype.getRandomPosition = function () {
    return this.pixelSize * Math.round((Math.random() * this.squareSize) / this.pixelSize);
};

SnakeScene.prototype.getCenterByX = function () {
    return this.pixelSize * Math.round((this.squareSize + this.pixelSize ) / 2 / this.pixelSize);
};

SnakeScene.prototype.stopMove = function () {

    if (this.debug) {
        cancelAnimationFrame(this.frame);
    } else {
        clearInterval(this.frame);
    }
    return this;
};

SnakeScene.prototype.step = function () {
    this.move();
    requestAnimationFrame(this.step.bind(this))
};

SnakeScene.prototype.resume = function () {
    this.stopMove();
    this.startMove();
};

SnakeScene.prototype.startMove = function () {

    if (this.debug) {
        this.frame = requestAnimationFrame(this.step.bind(this));
    } else {
        this.frame = setInterval(this.move.bind(this), this.speed);
    }

    return this;
};


SnakeScene.prototype.addSnakeNode = function () {
    var node = new SnakeNode(this.pixelSize);
    this.add(node.getNodeElement());
    this.snake.addNode(node);
};

SnakeScene.prototype.move = function () {

    if (this.isOverlapped(this.snake.head.position.x, this.snake.head.position.y) || this.snake.isHitSelf()) {
        this.stopMove();
        this.stopGame();
        return false;
    }

    var positionChanged;

    if (!this.debug) {
        positionChanged = this.snake.head.headStep(
            this.snake.head.position.direction
        );
    } else {
        positionChanged = this.snake.head.headMouseStep(
            this.pixelSize * Math.round(this.mousePosition.x / this.pixelSize),
            this.pixelSize * Math.round(this.mousePosition.y / this.pixelSize),
            this.mousePosition.direction
        );
    }

    if (positionChanged) return false;

    if (this.snake.head.isIntersected(this.target.position.x, this.target.position.y)) {
        this.increaseScore(1.2);
        this.addSnakeNode();

        this.speed /= this.speedIncreaseLevel;
        this.shuffleTargetPosition();
        this.resume();
    }

    this.snake.moveNodes();

    if (this.stepLevel > 1000) {
        this.increaseScore(1);
        this.speedIncreaseLevel = 1.05;
    }

    if (this.stepLevel > 300 && this.stepLevel < 1000) {
        this.speedIncreaseLevel = 1.2;
    }

    this.stepLevel++;

    return true;
};


var game = new SnakeScene({
    pixelSize: 10,
    debug: false,
    speed : 200
});

game.start();