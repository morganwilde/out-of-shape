/**
 * Engine attribute definition
 */
function Engine()
{
  // Canvas size
  /** @property {Integer} */
  this.width;
  /** @property {Integer} */
  this.height;
  // THREE
  /** @property {THREE.Scene} */
  this.scene;
  /** @property {THREE.PerspectiveCamera} */
  this.camera;
  /** @property {THREE.WebGLRenderer} */
  this.renderer;
  /** @property {Arena} */
  this.arena;
}

// Initialisers
/**
 * Initializes an Engine object with an empty state.
 * @return {Engine}
 */
Engine.prototype.initEmpty = function()
{
  // Canvas size
  this.width = null;
  this.height = null;
  // THREE
  this.scene = null;
  this.camera = null;
  this.renderer = null;
  this.arena = null;

  return this;
};
/**
 * Initializes an Engine object with specific screen dimensions.
 * @param  {Integer} width
 * @param  {Integer} height
 * @return {Engine}
 */
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
  this.camera.position.y = 800;

  // Rendered
  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setClearColor(0xffffff);
  this.renderer.setSize(this.width, this.height);
  document.body.appendChild(this.renderer.domElement);
    
  // User actions
  window.addEventListener('keydown', this.keyDown, false);
  window.addEventListener('keyup', this.keyUp, false);
  
  
  return this;
};

// Methods
/**
 * The frame render method, which is called every time the renderer needs a need frame.
 */
Engine.prototype.render = function()
{
  requestAnimationFrame(function() {
    this.render();
  }.bind(this));
  this.renderer.render(this.scene, this.camera);
  
  this.arena.update();
    
};
/**
 * Responds to keyDown events from the keyboard.
 * @param  {Event} event
 */
Engine.prototype.keyDown = function(event)
{
  event.preventDefault();
  this.arena.setKeyPress(event.keyCode);
  
};
/**
 * Responds to keyUp events from the keyboard.
 * @param  {Event} event
 */
Engine.prototype.keyUp = function(event)
{
  event.preventDefault();
  this.arena.setKeyRelease(event.keyCode);
};
/**
 * Assigns an Arena object that will contain all the necessary visuals for the game.
 * @param {Arena} arena
 */
Engine.prototype.addArena = function(arena)
{
  this.arena = arena;
  this.scene.add(arena.getRootObject());
};