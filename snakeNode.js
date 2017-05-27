function SnakeNode(scene) {
    this.scene = scene;
    this.element = null;
    this.index = 0;

    IHavePosition.call(this, SnakeNode);
}

SnakeNode.prototype.headStep = function () {

    this.lastPosition = {
        x: this.position.x,
        y: this.position.y
    };

    if (!this.scene.debug) {
        if (this.direction === 'bottom') {
            this.position.y += this.scene.pixelSize;
            this.element.style.top = this.position.y + 'px';
        }

        if (this.direction === 'left') {
            this.position.x -= this.scene.pixelSize;
            this.element.style.left = this.position.x + 'px';
        }

        if (this.direction === 'right') {
            this.position.x += this.scene.pixelSize;
            this.element.style.left = this.position.x + 'px';
        }

        if (this.direction === 'top') {
            this.position.y -= this.scene.pixelSize;
            this.element.style.top = this.position.y + 'px';
        }

    } else {
        this.direction = this.scene.mousePosition.direction;
        this.setX(this.scene.pixelSize * Math.round(this.scene.mousePosition.x / this.scene.pixelSize));
        this.setY(this.scene.pixelSize * Math.round(this.scene.mousePosition.y / this.scene.pixelSize));
    }

    return this.positionEqualsTo(this.lastPosition);
};

SnakeNode.prototype.moveNext = function (node) {

    this.setX(node.lastPosition.x);
    this.setY(node.lastPosition.y);

    var next = this.scene.snake.nodes[this.index + 1];
    if (next) {
        next.moveNext(this);
    }

};

SnakeNode.prototype.positionEqualsTo = function (pos) {
    return (this.position.x === pos.x && this.position.y === pos.y);
};


SnakeNode.prototype.createNodeElement = function (x, y) {

    this.element = document.createElement('div');
    this.element.classList.add('node');
    this.element.style.backgroundColor = 'brown';
    this.element.style.width = this.element.style.height = this.scene.pixelSize + 'px';
    this.element.style.position = 'absolute';
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';

    this.position.x = x;
    this.position.y = y;

    return this;
};


SnakeNode.prototype.toScene = function () {
    this.scene.container.appendChild(this.element);
    return this;
};


SnakeNode.prototype.setX = function (x) {
    this.lastPosition.x = this.position.x;

    this.position.x = x;
    this.element.style.left = x + 'px';
    return this;
};

SnakeNode.prototype.setY = function (y) {
    this.lastPosition.y = this.position.y;
    this.position.y = y;
    this.element.style.top = y + 'px';
    return this;
};