/**
 * Created by j on 5/25/17.
 */


function IHavePosition() {
    this.position = {
        x: 0,
        y: 0
    };

    this.lastPosition = {
        x: 0,
        y: 0
    };

    this.direction = 'bottom';
}


function SnakeScene(options) {
    this.hasPlaying = false;
    this.target = null;
    this.snake = null;
    this.pixelSize = 10;
    this.container = document.getElementById('scene');
    this.score = 0;
    this.scoreContainer = document.getElementById('score');
    this.mousePosition = {};
    this.debug = true;
    Object.assign(this, options);

    this.squareSize = this.pixelSize * 50;
    this.originalSquareSize = (this.squareSize + this.pixelSize);
}


SnakeScene.prototype.initListeners = function () {
    var last = {x: 0, y: 0}, direction = 'bottom';

    this.container.addEventListener('mousemove',
        function (event) {

            var deltaX = last.x - event.clientX,
                deltaY = last.y - event.clientY;

            if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
                direction = 'left';
            } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
                direction = 'right';
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
                direction = 'top';
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
                direction = 'bottom';
            }

            this.mousePosition = {
                x: event.clientX - this.container.offsetLeft,
                y: event.clientY - this.container.offsetTop,
                direction: direction
            };

            last = {
                x: event.clientX,
                y: event.clientY
            };
        }.bind(this));
};

SnakeScene.prototype.increaseScore = function (factor) {
    this.score += this.pixelSize;
    this.score *= factor;
    this.score = Math.round(this.score);
    this.scoreContainer.innerText = this.score;
};

SnakeScene.prototype.stopGame = function () {

    this.container.style.boxShadow = 'tomato 0px 0px 4px 3px';
    this.snake.stopMove();

    if (this.score > (+localStorage.bestscore || 0)) {
        localStorage.bestscore = this.score;
    }
};

SnakeScene.prototype.initScene = function () {
    this.container.style.width = this.container.style.height = this.originalSquareSize + 'px';
    this.container.style.backgroundColor = '#99CC99';
    this.container.style.position = 'relative';
    return this;
};


SnakeScene.prototype.start = function () {
    document.getElementById('bestScore').innerText = (+localStorage.bestscore | 0).toString();
    this.initScene()
        .initListeners();
    this.target = new Target(this).init();
    this.snake = new Snake(this)
        .init()
        .startMove()
        .initListeners();

    this.hasPlaying = true;
};


SnakeScene.prototype.getRandomPosition = function () {
    return this.pixelSize * Math.round((Math.random() * this.squareSize) / this.pixelSize);
};

SnakeScene.prototype.getCenterByX = function () {
    return this.pixelSize * Math.round((this.squareSize + this.pixelSize ) / 2 / this.pixelSize);
};


var game = new SnakeScene({
    pixelSize: 10,
    debug: false
});

game.start();