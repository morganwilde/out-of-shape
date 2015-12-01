<<<<<<< HEAD
/** 
* The Arena is the space in which two players fight in. It has an THREE.Object3D instance which serves as the platform for PlayerCharacters to stand on. The two PlayerCharacters are instantiated as children of the Arena.
*
* @constructor
*/
function Arena() {
	/** @property {float} width - The width of the Arena platform. */
	this.width;
	/** @property {float} height - The height of the Arena platform. */
	this.height;
	/** @property {float} depth - The depth of the Arena platform. */
	this.depth;
	/** @property {Object3D} rootObject - The box object that defines the base platform for all other 3D objects to sit on. */
	this.rootObject;
	/** @property {PlayerCharacter} player1 - The PlayerCharacter of the user called "Player 1". */
	this.player1;
	/** @property {PlayerCharacter} player1 - The PlayerCharacter of the user called "Player 2". */
	this.player2;
}


/** 
* Contructor of the Arena class. Sets all instance variables to null.
*
* @return {Arena}
*/
Arena.prototype.initEmpty = function()
{
	/** set canvas width to null */
	this.width = null;
	/** set canvas height to null */
	this.height = null;
	/** set canvas depth to null */
	this.depth = null;
	/** set root  to null */
	this.rootNode = null;
	/** set player character 1 to null */
	this.player1 = null;
	/** set player character 2 to null */
	this.player2 = null;

	return this;
};

/** 
* Instantiate the Arena class with an Engine instance.
* 
* @param {Engine} engine - The Engine instance passed to the constructor.
* 
* @return {Arena} initWithEngine - Return the Arena with contructed dimensions.
*/
Arena.prototype.initWithEngine = function(engine)
{
	/** set the canvas width as engine.width */
	this.width = engine.width;
	/** set the canvas height as engine.height*/
	this.height = engine.height;
	/** set the canvas depth to 1000*/
	this.depth = 1000;

	/**Create variable xScale and set it as 1.1 */
	var xScale = 1.1;
	/** create variable yScale and set it as 1.1 */
	var yScale = 1.1;
	/** create variable zScale and set it as .9 */
	var zScale = .9;

	/**
	* create a geometry ( canvas ) as a base of the arena. Rhe plane will be initialized with xScale(width), yScale(height), and zScale(depth).
	*/
	var geometry = new THREE.CubeGeometry(this.width*xScale, this.height*yScale, this.depth*zScale);

	/** create plane object in the canvas */
	var material = new THREE.MeshPhongMaterial({
		color: 0xff0000, 
		wireframe: false,
		specular: 0x000000,
		shininess: 30, 
		shading: THREE.FlatShading
	}); 

	this.rootObject = new THREE.Mesh(geometry, material);

	var light = new THREE.PointLight(0xffffff, 3, 0, 0);
	light.position.set(0, 500, 500);
	
	this.rootObject.add(light);

	return this;
};

/** 
* Get rootObject, the THREE.Object3D box.
* 
* @return {THREE.Object3D} Instance of THREE.Object3D.
*/
Arena.prototype.getRootObject = function()
{
    /** return root object */
	return this.rootObject;
};

/**
* Sets the state of keys when they are pressed.
* 
* @param {Integer} keycode - Key to be checked.
*/
Arena.prototype.setKeyPress = function(keycode)
{
	this.player1.setKeyPress(keycode);
	this.player2.setKeyPress(keycode);
};

/**
* Sets the state of keys when they are released.
* 
* @param {Integer} keycode - Key to be checked.
*/
Arena.prototype.setKeyRelease = function(keycode)
{
	this.player1.setKeyRelease(keycode);
	this.player2.setKeyRelease(keycode);
};

/** 
* Take a PlayerCharacter instance and assign it to either player1 or player2, then adjust that PlayerCharacter's position appropriately.
* A Healthbar is also added and assigned to the player.
* 
* @param {PlayerCharacter} playercharacter - Takes in a PlayerCharacter class.
*/
Arena.prototype.addPlayerCharacter = function(playerCharacter)
{
	/** create player character node */
	var playerCharacterNode = playerCharacter.getCollider().getNode();
	/** set  /
	playerCharacterNode.position.y = this.getRootObject().geometry.parameters.height/2 + playerCharacter.getCollider().getHeight()/2;

	/** create healthbar genometry  */
	var healthY = this.getRootObject().geometry.parameters.height/2+ 800;
	
	if(this.player1 == undefined)
	{
		/** assign player character to player 1 */
		this.player1 = playerCharacter;
		/** set initial postion for player 1 */
		playerCharacterNode.position.x = -this.getRootObject().geometry.parameters.width/4;

		/** create healthbar geomotry for healthbar */
		var healthX = -this.getRootObject().geometry.parameters.width/2.5;

		/** initialize and assign healthbar to healthbar2 */
		var healthBar1 = new HealthBar().initWithSettings(healthX, healthY, 600, 70, 100);

		/** assign healthbar1 to player 1 */
		this.player1.setHealthBar(healthBar1);
		/** add healthbar1 to node */
		this.rootObject.add(healthBar1.getNode());
	}
	else
	{
		/** set player 2 as player character */
		this.player2 = playerCharacter;
		/** set initial position for player 2 */
		playerCharacterNode.position.x = this.getRootObject().geometry.parameters.width/4;
		/** set player 2 as enemy of player 1*/
		this.player1.setEnemy(this.player2);
		/** set player 1 as a enemy of player 2*/
		this.player2.setEnemy(this.player1);

		/** Create a geometry for healthbar */
		var healthX = this.getRootObject().geometry.parameters.width/2.5;
		/** initalize and assign the heathbar to healthbar2 */
		var healthBar2 = new HealthBar().initWithSettings(healthX, healthY, 600, 70, 100);
		/** assign healthbar2 to player 2*/
		this.player2.setHealthBar(healthBar2);
		/** add healthbar2 to node */
		this.rootObject.add(healthBar2.getNode());
	}
	
	this.rootObject.add(playerCharacterNode);
};


/** 
* Update the status of player1 and player2 on each frame. 
*/
Arena.prototype.update = function()
{
	/** update player 1 character */
	this.player1.update();
	/** update player 2 character */
	this.player2.update();

	keyboard.updateKeyBuffers();
=======
function Arena() {
  // Size
  this.width;
  this.height;
  this.depth;
  // Root of type Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D
  this.rootObject;
}

// Initialisers

Arena.prototype.initEmpty = function()
{
  // Canvas size
  this.width = null;
  this.height = null;
  this.depth = null;
  // Root
  this.rootNode = null;

  return this;
};

Arena.prototype.initWithEngine = function(engine)
{
   this.width = engine.width;
   this.height = engine.height;
   this.depth = 1000;
   
   var xScale = 1.1;
   var yScale = 1.1;
   var zScale = .9;
   
   var geometry = new THREE.CubeGeometry(this.width*xScale, this.height*yScale, this.depth*zScale);
   var material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});   

   this.rootObject = new THREE.Mesh(geometry, material);

   return this;
};

// Getters

Arena.prototype.getRootObject = function()
{
   return this.rootObject;
};

// Methods

Arena.prototype.addPlayerCharacter = function(playerCharacter)
{
  var playerCharacterNode = playerCharacter.getNode();
  var shiftYBy = playerCharacter.height/2;
  playerCharacterNode.position.y = 400;
  
  this.rootObject.add(playerCharacterNode);
  
  return playerCharacter;
>>>>>>> 4e800954da9d2af517f229ac4cd7b43dc59e20d3
};