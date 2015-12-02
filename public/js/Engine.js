/**
 * The Engine is the main instance manager of the game. 
 *
 * @constructor
 */
function Engine()
{
  // Canvas size
  /** @property {Integer} width - The base width of the screen size relative to the machine's screen size. */
  this.width;
  /** @property {Integer} height - The base height of the screen size relative to the machine's screen size. */
  this.height;
  // THREE
  /** @property {THREE.Scene} scene - The THREE.js object that is used for managing rendered graphics. */
  this.scene;
  /** @property {THREE.PerspectiveCamera} camera - The THREE.js object that controls the perspective of the scene. */
  this.camera;
  /** @property {THREE.WebGLRenderer} renderer - The THREE.js object that is used for rendering graphics. */
  this.renderer;
  /** @property {Arena} - The platform that PlayerCharacters fight upon. */
  this.arena;

  this.gameState;

  this.mouse;
  this.buttonArray;

  this.bgMusic;
}

// Initialisers
/**
 * Initializes an Engine object with an empty state.
 * 
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
  this.gameState = null;
  this.mouse = null;
  this.buttonArray = new Array();
  this.bgMusic = null;

  return this;
};
/**
 * Initializes an Engine object with specific screen dimensions.
 * 
 * @param  {Integer} width - The base width of the camera.
 * @param  {Integer} height - The base height of the camera.
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

  var light = new THREE.PointLight(0xffffff, 3, 0, 0);
  light.position.set(0, 500, 500);
  
  this.scene.add(light);
  
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
  window.addEventListener('keydown', function(event){this.keyDown(event)}.bind(this), false);
  window.addEventListener('keyup', function(event){this.keyUp(event)}.bind(this), false);
  
  this.gameState = "Intro";

  this.mouse = new Mouse().init(this.camera, this);

  this.bgMusic = new Audio();
  this.playMusic('IntroMusic.ogg');
  this.bgMusic.addEventListener('ended', function() {this.play(); }, false);
  
  return this;
};

// Methods
/**
 * The frame render method, which is called every time the renderer needs a new frame.
 */

Engine.prototype.startFight = function()
{
  this.arena = new Arena().initWithEngine(this);
  this.scene.add(this.arena.getRootObject());

  this.arena.addPlayerCharacter(new SuperStar().init(100, 100, 100));
  this.arena.player1.setKeys(38, 40, 37, 39, 80, 219, 73, 221, 79, 76, 77);

  this.arena.addPlayerCharacter(new SuperStar().init(100, 100, 100));
  this.arena.player2.setKeys(87, 83, 65, 68, 82, 84, 85, 89, 90, 71, 72);

  this.gameState = "Fight";
  this.playMusic('EpicMusic.ogg');
};

/**
 * The frame render method, which is called every time the renderer needs a new frame.
 */
Engine.prototype.render = function()
{
  requestAnimationFrame(function() {
    this.render();
  }.bind(this));

  this.renderer.render(this.scene, this.camera);

  if(this.gameState == "Fight")
  {
    this.arena.update();
  }
    
};
/**
 * Responds to keyDown events from the keyboard.
 * 
 * @param  {Event} event - Instance of the JavaScript Event class that stores information about the event such as which key was pressed.
 */
Engine.prototype.keyDown = function(event)
{
  event.preventDefault();

  if(this.arena!=null)
  {
    this.arena.setKeyPress(event.which);
  }
};
/**
 * Responds to keyUp events from the keyboard.
 * 
 * @param  {Event} event - Instance of the JavaScript Event class that stores information about the event such as which key was pressed.
 */
Engine.prototype.keyUp = function(event)
{
  event.preventDefault();
  if(this.arena!=null)
  {
    this.arena.setKeyRelease(event.which);
  }
};
/**
 * Assigns an Arena object that will contain all the necessary visuals for the game.
 * 
 * @param {Arena} arena - The platform object which has PlayerCharacters as Children.
 */
Engine.prototype.addArena = function(arena)
{
  this.arena = arena;
  this.scene.add(arena.getRootObject());
};

Engine.prototype.addButton = function(button)
{
  this.scene.add(button.getNode());
  this.buttonArray.push(button.getNode());
};

Engine.prototype.getButtonArray = function()
{
  return this.buttonArray;
};

Engine.prototype.getGameState = function()
{
  return this.gameState;
};

Engine.prototype.setGameState = function(state)
{
  this.gameState = state;
};

Engine.prototype.deleteButton = function(button)
{
  document.body.removeChild(button.getTextDiv());

  this.scene.remove(button.getNode());

  var targetButton = this.buttonArray.indexOf(button);

  this.buttonArray.splice(targetButton, 1); // 1 is the number of instances to remove
};

Engine.prototype.playMusic = function(music)
{
  this.bgMusic.setAttribute('src', 'Music/'+music);
  this.bgMusic.play();
};