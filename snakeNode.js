function SnakeNode(pixelSize) {
    this.element = null;
    this.index = 0;
    this.pixelSize = pixelSize;
    this.next = null;
    this.prev = null;
    SnakeNodePosition.call(this);
}

SnakeNode.prototype = {
    bottom: function () {
        this.setY(this.position.y + this.pixelSize);
    },
    top: function () {
        this.setY(this.position.y - this.pixelSize);
    },
    right: function () {
        this.setX(this.position.x + this.pixelSize);
    },
    left: function () {
        this.setX(this.position.x - this.pixelSize);
    }
};

SnakeNode.prototype.headMouseStep = function (x, y, direction) {
    this.position.direction = direction;
    this.lastPosition = {
        x: this.position.x,
        y: this.position.y
    };

    this.setX(x);
    this.setY(y);

    return this.positionEqualsTo(this.lastPosition);
};

SnakeNode.prototype.headStep = function (direction) {
    this.lastPosition.direction = direction;
    this.lastPosition = {
        x: this.position.x,
        y: this.position.y
    };

    this[direction]();
    return this.positionEqualsTo(this.lastPosition);
};

SnakeNode.prototype.moveNext = function () {
    if (this.prev) {
        this.setX(this.prev.lastPosition.x);
        this.setY(this.prev.lastPosition.y);
    }
    if (this.next) {
        this.next.moveNext();
    }
};

SnakeNode.prototype.positionEqualsTo = function (x, y) {
    return (this.position.x === x && this.position.y === y);
};


SnakeNode.prototype.getNodeElement = function () {

    this.element = document.createElement('div');
    this.element.classList.add('node');
    this.element.style.backgroundColor = 'brown';
    this.element.style.width = this.element.style.height = this.pixelSize + 'px';
    this.element.style.position = 'absolute';

    return this.element;
};


SnakeNode.prototype.isIntersected = function (x, y) {
    var intersected = false;
    if (x === this.position.x && y === this.position.y) {
        intersected = true;
    }
    return intersected;
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