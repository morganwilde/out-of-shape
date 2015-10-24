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
};