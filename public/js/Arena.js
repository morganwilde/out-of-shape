/** 
* Arena has an Object3D which serves as the platform for PlayerCharacters to stand on.
* The two PlayerCharacters are instantiated as children of the Arena.
*
* @constructor
*/
function Arena() {
	/** Width of the canvas */
	this.width;
	/** Height of the canvas */
	this.height;
	/** Depth of the canvas */
	this.depth;
	/** Root of type Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D */
	this.rootObject;
	/**Player character 1 */
	this.player1;
	/**Player character 2 */
	this.player2;
}


/** 
* contructor of the arena class. Set everything to null
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
* Initate the arena class with engine class 
* @param {Engine} engine - Pass the engine class to the method
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
* get Root object 
* @return {object3D} rootObject return rootObject
*/
Arena.prototype.getRootObject = function()
{
    /** return root object */
	return this.rootObject;
};

/**
* sets the state of the key when it is pressed.
* @param {int} keycode - key to be checked
*/
Arena.prototype.setKeyPress = function(keycode)
{
	this.player1.setKeyPress(keycode);
	this.player2.setKeyPress(keycode);
};

/**
* sets the state of the key when it is released.
* @param {int} keycode - key to be checked
*/
Arena.prototype.setKeyRelease = function(keycode)
{
	this.player1.setKeyRelease(keycode);
	this.player2.setKeyRelease(keycode);
};

/** 
* Add player characters and assign them to player 1 and player 2. Healthbar is also added and assign to players.
* @param {PlayerCharacter} playercharacter - Takes in player character class
*
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
* Update the status of player 1 character and player 2 character 
*/
Arena.prototype.update = function()
{
	/** update player 1 character */
	this.player1.update();
	/** update player 2 character */
	this.player2.update();
};