function Engine() {
  // Canvas size
  this.width;
  this.height;
  // THREE
  this.scene;
  this.camera;
  this.renderer;
}

// Initialisers

Engine.prototype.initEmpty = function()
{
  // Canvas size
  this.width = null;
  this.height = null;
  // THREE
  this.scene = null;
  this.camera = null;
  this.renderer = null;

  return this;
};

Engine.prototype.initWithCanvasSize = function(width, height)
{
  this.initEmpty();

  // Canvas size
  this.width = width;
  this.height = height;

  // Scene
  this.scene = new THREE.Scene();
  
  // Camera
  this.camera = new THREE.PerspectiveCamera(60, this.width/this.height, 1, 2000);
  this.camera.position.z = 1500;

  // Rendered
  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setClearColor(0xffffff);
  this.renderer.setSize(this.width, this.height);
  document.body.appendChild(this.renderer.domElement);

  return this;
};

// Methods

Engine.prototype.render = function()
{
  requestAnimationFrame(function() {
    this.render();
  }.bind(this));
  this.renderer.render(this.scene, this.camera);
};

Engine.prototype.addArena = function(arena)
{
  this.scene.add(arena.getRootObject());
};