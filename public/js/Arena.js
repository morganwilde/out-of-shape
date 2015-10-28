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
  this.width = 500;
  this.height = 50;
  this.depth = 500;

  var geometry = new THREE.CubeGeometry(this.width, this.height, this.depth);
  var material = new THREE.MeshPhongMaterial({
    color: 0xff0000, 
    side: THREE.DoubleSide, 
    wireframe: false,
    specular: 0xee0000, 
    shininess: 30, 
    shading: THREE.FlatShading
  });

  var cube = new THREE.Mesh(geometry, material);

  // cube.position.setY(500);

  var light = new THREE.PointLight(0xffffff, 1, 0);
  light.position.set(0, 500, 500);

  cube.add(light);

  this.rootObject = cube;

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