ConsoleDelegate = function()
{
  this.consoleContainer;
  this.canvasContainer;
  this.mode;
  this.engine
  this.target;
  this.objectSelectorFrame;
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
  this.objectSelectorFrame = null;
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
  if (target) {
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

    // Inform the console of the change
    window.dispatchEvent(new Event('consoleTargetChanged'));
  }
};
ConsoleDelegate.prototype.showObjectSelector = function(targets, mouseX, mouseY)
{
  var selectorWidth = 100;
  var selectorHeightPerItem = 25;
  var selectorHeight = selectorHeightPerItem * targets.length - 1;
  var frameElement = document.createElement('div');
  frameElement.classList.add('console-object-selector-frame');
  frameElement.style.left = mouseX - selectorWidth/2 + 'px';
  frameElement.style.top = mouseY - selectorHeight/2 + 'px';
  frameElement.style.width = selectorWidth + 'px';
  frameElement.style.height = selectorHeight + 'px';

  function onObjectSelection(objectNumber) {
    this.setDebugTarget(targets[objectNumber].object);
  }

  for (var i = targets.length - 1; i >= 0; i--) {
    var targetObject = targets[i].object;
    var targetObjectId = targetObject.name.length > 0 ? targetObject.name : targetObject.uuid;

    var buttonElement = document.createElement('div');
    buttonElement.classList.add('console-object-selector-item');
    buttonElement.appendChild(document.createTextNode(targetObjectId));
    buttonElement.addEventListener('click', onObjectSelection.bind(this, i))

    frameElement.appendChild(buttonElement);
  };
  this.canvasContainer.appendChild(frameElement);

  this.objectSelectorFrame = frameElement;
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

ConsoleDelegate.prototype.observeMouse = function()
{
  this.canvasContainer.addEventListener('click', this.onMouseClick.bind(this));
};
ConsoleDelegate.prototype.onMouseClick = function(event)
{
  if (this.objectSelectorFrame == null) {
    var mouseX = (event.offsetX / this.engine.canvasContainerFrame.width) * 2 - 1;
    var mouseY = -(event.offsetY / this.engine.canvasContainerFrame.height) * 2 + 1;
    
    var vector = new THREE.Vector3(mouseX, mouseY, this.engine.camera.near);
    vector.unproject(this.engine.camera);

    var raycaster = new THREE.Raycaster(this.engine.camera.position, vector.sub(this.engine.camera.position).normalize());
    var object3DArray = raycaster.intersectObjects(this.engine.scene.children, true);

    if (object3DArray.length == 1) {
      this.setDebugTarget(object3DArray[0].object);
    } else {
      // Give the user the ability to select which object he wants as a target
      this.showObjectSelector(object3DArray, event.offsetX, event.offsetY);
    }
  } else {
    this.objectSelectorFrame.parentElement.removeChild(this.objectSelectorFrame);
    this.objectSelectorFrame = null;
  }
};

// Game

ConsoleDelegate.prototype.startFight = function()
{
  this.engine.startFight();
};