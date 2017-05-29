function Target(pixelSize) {
    this.element = null;
    this.pixelSize = pixelSize;
    SnakeNodePosition.call(this);
}


Target.prototype.getTargetElement = function () {
    var target = document.createElement('div');
    target.style.width = target.style.height = this.pixelSize + 'px';
    target.style.position = 'absolute';
    target.setAttribute('id','target');
    this.element = target;
    return target;
};

Target.prototype.setPosition = function (x, y) {
    this.position.x = x;
    this.position.y = y;
    this.element.style.top = y + 'px';
    this.element.style.left = x + 'px';
    return this.position;
};
