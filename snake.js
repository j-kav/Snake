function Snake(scene) {
    this.frame = null;
    this.scene = scene;
    this.head = null;
    this.speed = 1200;
    this.nodes = [];
    this.stepLevel = 0;
    this.nodeLevel = 0;
}

Snake.prototype.moveNodes = function () {
    if (this.nodes.length > 0) {
        this.nodes[this.nodeLevel].moveNext(this.head);
    }
};

Snake.prototype.addSnakeNode = function () {

    var x, y, ps = this.scene.pixelSize;

    if (this.head.direction === 'bottom') {
        x = this.head.lastPosition.x;
        y = this.head.lastPosition.y - ps;
    }

    if (this.head.direction === 'top') {
        x = this.head.lastPosition.x;
        y = this.head.lastPosition.y + ps;
    }

    if (this.head.direction === 'left') {
        x = this.head.lastPosition.x + ps;
        y = this.head.lastPosition.y;
    }

    if (this.head.direction === 'right') {
        x = this.head.lastPosition.x - ps;
        y = this.head.lastPosition.y;
    }

    var node = new SnakeNode(this.scene).createNodeElement().toScene();

    node.setX(x).setY(y);
    node.index = this.nodes.length;
    this.nodes.push(node);

    return this;
};

Snake.prototype.initListeners = function () {
    document.addEventListener('keydown', function (event) {

        switch (event.keyCode) {
            case 40:
                this.head.direction = 'bottom';
                break;
            case 38:
                this.head.direction = 'top';
                break;
            case 37:
                this.head.direction = 'left';
                break;
            case 39:
                this.head.direction = 'right';
                break;
        }

        if (event.keyCode === 27) {
            if (this.scene.hasPlaying) {
                this.stopMove();
            } else {
                this.startMove();
            }
            this.scene.hasPlaying = !this.scene.hasPlaying;
        }


    }.bind(this));

    return this;
};

Snake.prototype.init = function () {

    this.head = new SnakeNode(this.scene)
        .createNodeElement(this.scene.getCenterByX(), 0)
        .toScene();

    this.head.element.style.backgroundColor = 'black';
    return this;
};

Snake.prototype.move = function () {

    if (this.isOverlapped()) {
        this.stopMove();
        this.scene.stopGame();
        return false;
    }

    var positionChanged = this.head.headStep();

    if (!positionChanged) return false;

    if (this.isIntersected()) {
        this.scene.increaseScore(1.2);
        this.addSnakeNode();

        this.speed /= 1.2;
        this.scene.target.shufflePosition();
        this.resume();
    }


    this.moveNodes();
    if (this.stepLevel > 1000) {
        this.scene.increaseScore(1);
    }

    this.stepLevel++;

    return true;
};


Snake.prototype.resume = function () {
    this.stopMove();
    this.startMove();
};

Snake.prototype.isOverlapped = function () {
    var isOverlapped = false;
    if (this.head.position.x < 0 || this.head.position.x > this.scene.squareSize) {
        isOverlapped = true;
    }
    if (this.head.position.y < 0 || this.head.position.y > this.scene.squareSize) {
        isOverlapped = true;
    }

    return isOverlapped;
};

Snake.prototype.isIntersected = function () {
    var intersected = false;

    if (this.scene.target.position.x === this.head.position.x && this.scene.target.position.y === this.head.position.y) {
        intersected = true;
    }
    return intersected;
};


Snake.prototype.stopMove = function () {
    clearInterval(this.frame);
    return this;
};

Snake.prototype.step = function () {
    this.move();
    requestAnimationFrame(this.step.bind(this))
};

Snake.prototype.startMove = function () {

    if (this.scene.debug) {
        this.frame = requestAnimationFrame(this.step.bind(this));
    } else {
        this.frame = setInterval(this.move.bind(this), this.speed * 0.8);
    }

    return this;
};