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
   var material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});   

   this.rootObject = new THREE.Mesh(geometry, material);
   
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
	var playerCharacterNode = playerCharacter.getNode();
	
	if(this.player1 == undefined)
	{
		this.player1 = playerCharacter;
		playerCharacterNode.position.y = this.getRootObject().geometry.parameters.height/2;
		playerCharacterNode.position.x = -this.getRootObject().geometry.parameters.width/4;		
	}
	else
	{
		this.player2 = playerCharacter;
		playerCharacterNode.position.y = this.getRootObject().geometry.parameters.height/2;
		playerCharacterNode.position.x = this.getRootObject().geometry.parameters.width/4;
		
		this.player1.setEnemy(this.player2);
		this.player2.setEnemy(this.player1);
	}

	this.rootObject.add(playerCharacterNode);
};

Arena.prototype.update = function()
{
	this.player1.update();
	this.player2.update();
}