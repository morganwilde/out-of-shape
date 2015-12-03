ConsoleDelegate = function()
{
  this.consoleContainer;
  this.canvasContainer;
  this.mode;
  this.engine
  this.target;
  // Rotation
  this.rotationX;
  this.rotationY;
  this.rotationZ;
  // Position
  this.positionX;
  this.positionY;
  this.positionZ;
  // Bounding Box
  this.boundingBoxVertexCollection;
}

// ConsoleDelegate modes
ConsoleDelegate.modeInactive = 0;
ConsoleDelegate.modeActive = 1;

ConsoleDelegate.prototype.initEmpty = function()
{
  this.consoleContainer = null;
  this.canvasContainer = null;
  this.mode = ConsoleDelegate.modeInactive;
  this.engine = null;
  this.target = null;
  // Rotation
  this.rotationX = 0;
  this.rotationY = 0;
  this.rotationZ = 0;
  // Position
  this.positionX = 0;
  this.positionY = 0;
  this.positionZ = 0;
  // Bounding Box
  this.boundingBoxVertexCollection = null;

  return this;
};
ConsoleDelegate.prototype.initWithContainerIdAndEngine = function(consoleContainerId, canvasContainerId, engine)
{
  this.initEmpty();

  this.consoleContainer = document.querySelector('#' + consoleContainerId);
  this.canvasContainer = document.querySelector('#' + canvasContainerId);
  this.engine = engine;

  return this;
};

ConsoleDelegate.createWithContainerIdAndEngine = function(consoleContainerId, canvasContainerId, engine)
{
  return window.consoleDelegate = new ConsoleDelegate().initWithContainerIdAndEngine(consoleContainerId, canvasContainerId, engine);
};

// Getters

ConsoleDelegate.prototype.getTarget = function()
{
  return this.target;
};
ConsoleDelegate.prototype.hasTarget = function()
{
  return this.getTarget() != null;
};

// Methods

ConsoleDelegate.prototype.setMode = function(mode)
{
  this.mode = mode;
};
ConsoleDelegate.prototype.activate = function()
{
  this.setMode(ConsoleDelegate.modeActive);
  if (!this.consoleContainer.querySelector('container-fluid')) {
    this.render();
  }
};
ConsoleDelegate.prototype.deactivate = function()
{
  this.setMode(ConsoleDelegate.modeInactive);
  this.unrender();
};
ConsoleDelegate.prototype.setDebugTarget = function(target)
{
  if (this.mode == ConsoleDelegate.modeActive || true) {
    var object3D = target instanceof THREE.Object3D ? target : target.getObject3D();
    // Rotation
    this.rotationX = object3D.rotation.x;
    this.rotationY = object3D.rotation.y;
    this.rotationZ = object3D.rotation.z;
    // Position
    this.positionX = object3D.position.x;
    this.positionY = object3D.position.y;
    this.positionZ = object3D.position.z;

    this.target = object3D;
  }
};
ConsoleDelegate.prototype.debug = function()
{
  if (this.mode == ConsoleDelegate.modeActive && this.target) {
    // Rotation
    this.target.rotation.x = this.rotationX;
    this.target.rotation.y = this.rotationY;
    this.target.rotation.z = this.rotationZ;
    // Position
    this.target.position.x = this.positionX;
    this.target.position.y = this.positionY;
    this.target.position.z = this.positionZ;
  }
};
ConsoleDelegate.prototype.toggleTargetsVertexCollection = function()
{
  if (this.boundingBoxVertexCollection) {
    this.boundingBoxVertexCollection.eraseFromTargetObject3D();
    this.boundingBoxVertexCollection = null;
  } else {
    this.boundingBoxVertexCollection = new VertexCollection().initWithObject3DBox(this.target);
    this.boundingBoxVertexCollection.drawOntoObject3D(this.engine.getScene());
  }
};
ConsoleDelegate.prototype.toggleTargetsVertexCollectionDOMProjection = function()
{
  if (!this.boundingBoxVertexCollection) {
    this.boundingBoxVertexCollection = new VertexCollection().initWithObject3DBox(this.target);
  }
  this.boundingBoxVertexCollection.drawOntoDOMElementWithIdUsingCamera('canvas-container', this.engine.getCamera());
};
ConsoleDelegate.prototype.toggleTargetsBoundingBoxDOMProjection = function()
{
  if (!this.boundingBoxVertexCollection) {
    this.boundingBoxVertexCollection = new VertexCollection().initWithObject3DBox(this.target);
  }
  this.boundingBoxVertexCollection.drawOntoDOMElementWithIdBoundingBoxUsingCamera('canvas-container', this.engine.camera);
};

ConsoleDelegate.prototype.render = function()
{
  ReactDOM.render(React.createElement(Console), this.consoleContainer);
};
ConsoleDelegate.prototype.unrender = function()
{
  this.consoleContainer.removeChild(this.consoleContainer.querySelector('.container-fluid'));
};

ConsoleDelegate.prototype.hide = function()
{
  this.consoleContainer.style.display = 'none';
  this.canvasContainer.style.marginLeft = 0 + 'px';
};

// Game

ConsoleDelegate.prototype.startFight = function()
{
  this.engine.startFight();
};