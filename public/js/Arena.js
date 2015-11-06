function Arena() {
	// Size
	this.width;
	this.height;
	this.depth;
	// Root of type Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D
	this.rootObject;
	//Player characters
	this.player1;
	this.player2;
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
	//Player characters
	this.player1 = null;
	this.player2 = null;

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
	var material = new THREE.MeshPhongMaterial({
		color: 0xff0000, 
		//side: THREE.DoubleSide, 
		wireframe: false,
		specular: 0x000000, 
		shininess: 30, 
		shading: THREE.FlatShading
	}); 

	this.rootObject = new THREE.Mesh(geometry, material);

	var light = new THREE.PointLight(0xffffff, 3, 0, 0);
	light.position.set(0, 500, 500);
	
	this.rootObject.add(light);

	this.rootObject.name = "q";

	return this;
};

// Getters

Arena.prototype.getRootObject = function()
{
	return this.rootObject;
};

// Setters

Arena.prototype.setKeyPress = function(keycode)
{
	this.player1.setKeyPress(keycode);
	this.player2.setKeyPress(keycode);
}

Arena.prototype.setKeyRelease = function(keycode)
{
	this.player1.setKeyRelease(keycode);
	this.player2.setKeyRelease(keycode);
}

// Methods

Arena.prototype.addPlayerCharacter = function(playerCharacter)
{
	var playerCharacterNode = playerCharacter.getCollider().getNode();

	playerCharacterNode.position.y = this.getRootObject().geometry.parameters.height/2 + playerCharacter.getCollider().getHeight()/2;

	var healthY = this.getRootObject().geometry.parameters.height/2+ 800;
	
	if(this.player1 == undefined)
	{
		this.player1 = playerCharacter;
		playerCharacterNode.position.x = -this.getRootObject().geometry.parameters.width/4;

		var healthX = -this.getRootObject().geometry.parameters.width/2.5;

		var healthBar1 = new HealthBar().initWithSettings(healthX, healthY, 600, 70, 100, 0x00ff0f, 0xff0000);

		this.player1.setHealthBar(healthBar1);
		this.rootObject.add(healthBar1.getNode());
	}
	else
	{
		this.player2 = playerCharacter;
		playerCharacterNode.position.x = this.getRootObject().geometry.parameters.width/4;
		this.player1.setEnemy(this.player2);
		this.player2.setEnemy(this.player1);

		var healthX = this.getRootObject().geometry.parameters.width/2.5;

		var healthBar2 = new HealthBar().initWithSettings(healthX, healthY, 600, 70, 347, 0x00ff0f, 0xff0000);

		this.player2.setHealthBar(healthBar2);
		this.rootObject.add(healthBar2.getNode());
	}

	this.rootObject.add(playerCharacterNode);
};

Arena.prototype.update = function()
{
	this.player1.update();
	this.player2.update();
}