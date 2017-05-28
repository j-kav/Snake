function Target(pixelSize) {
    this.element = null;
    this.pixelSize = pixelSize;
    SnakeNodePosition.call(this);
}


Target.prototype.getTargetElement = function () {
    var target = document.createElement('div');
    target.setAttribute('id', 'target');
    target.style.width = target.style.height = this.pixelSize + 'px';
    target.style.position = 'absolute';

    target.style.top = this.position.y + 'px';
    target.style.left = this.position.x + 'px';

    return target;
};

Target.prototype.setPosition = function (x,y) {
    this.position.x = x;
    this.position.y = y;
    return this.position;
};
