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
  this.keyboard;
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
  this.Keyboard = null;

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
  
  this.gameState = "Intro";

  this.mouse = new Mouse().init(this.camera, this);

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var cube = new THREE.Mesh( geometry, material );
this.scene.add( cube );

  this.bgMusic = new Audio();
  this.playMusic('IntroMusic.ogg');
  this.bgMusic.addEventListener('ended', function() {this.play(); }, false);
  
  return this;
};

// Methods

Engine.prototype.startFight = function()
{
  this.arena = new Arena().initWithEngine(this);
  this.scene.add(this.arena.getRootObject());

  this.keyboard = new Keyboard().initEmpty();
  this.arena.addPlayerCharacter(new SuperStar().init(100, 100, 100));

  this.keyboard.setKeys(this.arena.player1.playerNumber, 38, 40, 37, 39, "P".charCodeAt(0),  "J".charCodeAt(0),  "O".charCodeAt(0),  "U".charCodeAt(0),  "I".charCodeAt(0),  "L".charCodeAt(0),  "K".charCodeAt(0));
  //this.arena.player1.setKeys(38, 40, 37, 39, "P".charCodeAt(0),  "J".charCodeAt(0),  "O".charCodeAt(0),  "U".charCodeAt(0),  "I".charCodeAt(0),  "L".charCodeAt(0),  "K".charCodeAt(0));

  this.arena.addPlayerCharacter(new SuperStar().init(100, 100, 100));
  this.keyboard.setKeys(this.arena.player2.playerNumber, "W".charCodeAt(0),  "S".charCodeAt(0), "A".charCodeAt(0),  "D".charCodeAt(0),  "E".charCodeAt(0),  "R".charCodeAt(0),  "F".charCodeAt(0),  "G".charCodeAt(0),  "T".charCodeAt(0),  "C".charCodeAt(0),  "V".charCodeAt(0));

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
    this.keyboard.updateKeyBuffers();
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