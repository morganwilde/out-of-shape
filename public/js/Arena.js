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
   
   var xScale = .9;
   var yScale = .9;
   
   var geometry = new THREE.PlaneGeometry(this.width*xScale, this.height*yScale);
   var material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});   

   this.rootObject = new THREE.Mesh(geometry, material);
   this.rootObject.position.y -= 300;
   this.rootObject.rotation.x -= 30;

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
  var shiftYBy = playerCharacter.depth / 2;
  playerCharacterNode.position.z -= shiftYBy;
  this.rootObject.add(playerCharacterNode);
};
