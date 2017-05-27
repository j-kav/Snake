function Target(scene) {
    this.scene = scene;
    this.element = null;

    IHavePosition.call(this, Target);
}

Target.prototype.init = function () {
    this.element = this.getTargetElement();
    this.scene.container.appendChild(this.element);
    return this;
};

Target.prototype.getTargetElement = function () {
    var target = document.createElement('div');
    target.setAttribute('id', 'target');
    target.style.backgroundColor = 'red';
    target.style.width = target.style.height = this.scene.pixelSize + 'px';
    target.style.position = 'absolute';

    this.position.y = this.scene.getRandomPosition();
    this.position.x = this.scene.getRandomPosition();

    target.style.top = this.position.y + 'px';
    target.style.left = this.position.x + 'px';

    return target;
};

Target.prototype.shufflePosition = function () {
    this.element = document.getElementById('target');
    this.scene.container.replaceChild(this.getTargetElement(), this.element);
    return this;
};