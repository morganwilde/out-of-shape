function Engine() {
  // Canvas container
  this.canvasContainer;
  this.canvasContainerFrame;
  // Canvas size
  this.width;
  this.height;
  // THREE
  this.scene;
  this.camera;
  this.renderer;
  this.lights;
  this.arena;
  // Mode
  this.mode;
}

Engine.modeRegular = 0;
Engine.modeDebug = 1;

// Initialisers

Engine.prototype.initEmpty = function()
{
  // Canvas container
  this.canvasContainer = null;
  this.canvasContainerFrame = null;
  // Canvas size
  this.width = null;
  this.height = null;
  // THREE
  this.scene = null;
  this.camera = null;
  this.renderer = null;
  this.lights = null;
  this.arena = null;
  // Mode
  this.mode = Engine.modeRegular;

  window.engineDebug = {
    azimuthalAngle: 0,
    polarAngle: 0,
    rotationAxisIndicatorBox: null,
    rotation: 0
  };

  return this;
};

Engine.prototype.initWithCanvasContainerId = function(canvasContainerId)
{
  this.initEmpty();

  this.canvasContainer = document.querySelector('#' + canvasContainerId);
  this.canvasContainerFrame = this.canvasContainer.getBoundingClientRect();

  // Scene
  this.scene = new THREE.Scene();
  
  // Camera
  this.camera = new THREE.PerspectiveCamera(60, this.canvasContainerFrame.width/this.canvasContainerFrame.height, 1, 2000);
  this.camera.position.z = 1000;
  // this.camera.position.y = 800;
  // this.camera.rotation.x = 0;

  // Rendered
  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setClearColor(0xcccccc);
  this.renderer.setSize(this.canvasContainerFrame.width, this.canvasContainerFrame.height);
  document.querySelector('#canvas-container').appendChild(this.renderer.domElement);
  
  // User actions
  window.addEventListener('keydown', this.keyDown, false);
  window.addEventListener('keyup', this.keyUp, false);
  
  return this;
};

// Methods

Engine.prototype.render = function()
{
  requestAnimationFrame(function() {
    // Debug
    if (this.mode == Engine.modeDebug) {
      this.debug();
    }
    // Regular
    this.render();
  }.bind(this));
  this.renderer.render(this.scene, this.camera);
};

Engine.prototype.debug = function()
{
  var arena = this.arena.getRootObject();
  var quaternion = new THREE.Quaternion();
  var rotationAxisVector = new THREE.Vector3(
    Math.sin(window.engineDebug.polarAngle) * Math.cos(window.engineDebug.azimuthalAngle), 
    Math.sin(window.engineDebug.polarAngle) * Math.sin(window.engineDebug.azimuthalAngle),
    Math.cos(window.engineDebug.polarAngle)
  );
  quaternion.setFromAxisAngle(
    rotationAxisVector,
    window.engineDebug.rotation
  );
  arena.setRotationFromQuaternion(quaternion);

  if (window.engineDebug.rotationAxisIndicatorBox == null) {
    var axisIndicatorBoxGeometry = new THREE.CubeGeometry(this.canvasContainerFrame.width, 10, 10);
    var axisIndicatorBoxMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00, 
      side: THREE.DoubleSide, 
      wireframe: false,
      specular: 0xee0000, 
      shininess: 30, 
      shading: THREE.FlatShading
    });
    var axisIndicatorBox = new THREE.Mesh(axisIndicatorBoxGeometry, axisIndicatorBoxMaterial);
    this.scene.add(axisIndicatorBox);
    window.engineDebug.rotationAxisIndicatorBox = axisIndicatorBox;
  }
  
  var rotationAxisVectorOld = new THREE.Vector3(
    0,
    1,
    0
  );
  var rotationAxisQuaternion = new THREE.Quaternion().setFromUnitVectors(rotationAxisVector, rotationAxisVectorOld);
  window.engineDebug.rotationAxisIndicatorBox.setRotationFromQuaternion(rotationAxisQuaternion);
};

Engine.prototype.keyDown = function(event)
{
	return event.key;
};

Engine.prototype.keyUp = function(event)
{
};

Engine.prototype.addArena = function(arena)
{
  this.arena = arena;
  this.scene.add(arena.getRootObject());
};