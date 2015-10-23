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

   var geometry = new THREE.PlaneGeometry(5, 20, 32);
   var material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});

   this.rootObject = new THREE.Mesh(geometry, material);

   return this;
};

// Getters

Arena.prototype.getRootObject = function()
{
   return this.rootObject;
};