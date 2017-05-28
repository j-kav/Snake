function Snake(pixelSize) {
    this.head = null;
    this.nodes = [];
    this.stepLevel = 0;
    this.pixelSize = pixelSize;
}

Snake.prototype.moveNodes = function () {
    if (this.nodes.length > 0) {
        this.head.moveNext();
    }
};

Snake.prototype.getNextNodePosition = function () {
    var x, y, ps = this.pixelSize;

    if (this.head.position.direction === 'bottom') {
        x = this.head.lastPosition.x;
        y = this.head.lastPosition.y - ps;
    } else if (this.head.position.direction === 'top') {
        x = this.head.lastPosition.x;
        y = this.head.lastPosition.y + ps;
    } else if (this.head.position.direction === 'left') {
        x = this.head.lastPosition.x + ps;
        y = this.head.lastPosition.y;
    } else if (this.head.position.direction === 'right') {
        x = this.head.lastPosition.x - ps;
        y = this.head.lastPosition.y;
    }

    return {x: x, y: y};
};

Snake.prototype.addNode = function (node) {
    var position = this.getNextNodePosition();

    node.setX(position.x).setY(position.y);
    node.index = this.nodes.length;

    if (node.index >= 1) {
        this.nodes[node.index - 1].next = node;
        node.prev = this.nodes[node.index - 1];
    } else if (node.index === 0) {
        this.head.next = node;
        node.prev = this.head;
    }

    this.nodes.push(node)
};

Snake.prototype.isHitSelf = function () {
    var isHitSelf = false;

    this.nodes.forEach(function (node) {
        if (this.head.positionEqualsTo(node.position.x, node.position.y)) {
            isHitSelf = true;
        }
    }.bind(this));

    return isHitSelf;
};

Snake.prototype.setDirection = function (direction) {
    this.head.lastPosition.direction = this.head.position.direction;
    this.head.position.direction = direction;
};