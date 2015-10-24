function Engine() {
  // Canvas size
  this.width;
  this.height;
  // THREE
  this.scene;
  this.camera;
  this.renderer;
  this.lights;
  this.arena;
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
  this.lights = null;
  this.arena = null;

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
  this.camera.position.z = 1000;
  this.camera.position.y += 100;

  // Rendered
  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setClearColor(0xffffff);
  this.renderer.setSize(this.width, this.height);
  document.body.appendChild(this.renderer.domElement);

  // Lights
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set( 0, 1, 0 );
  this.scene.add( directionalLight );
  
  // User actions
  window.addEventListener('keydown', this.keyDown, false);
  window.addEventListener('keyup', this.keyUp, false);
  
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

Engine.prototype.keyDown = function(event)
{
	console.log(event);
};

Engine.prototype.keyUp = function(event)
{
	console.log(event);
};

Engine.prototype.addArena = function(arena)
{
  this.arena = arena;
  this.scene.add(arena.getRootObject());
};