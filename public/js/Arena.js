function Arena() {
   // Size
   this.width;
   this.height;
   this.depth;
   // Root of type Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D
   this.object3D;
}

// Initialisers

Arena.prototype.initEmpty = function()
{
   // Size
   this.width = null;
   this.height = null;
   this.depth = null;
   // Root
   this.object3D = null;

   return this;
};
Arena.prototype.initWithDimensions = function(width, height, depth, position)
{
   this.initEmpty();

   var geometry = new THREE.CubeGeometry(width, height, depth);
   var material = new THREE.MeshPhongMaterial({
      color: 0xffffff, 
      specular: 0xffffff, 
      shininess: 20, 
      morphTargets: true, 
      vertexColors: THREE.FaceColors, 
      shading: THREE.FlatShading
   });

   this.object3D = new THREE.Mesh(geometry, material);
   // Settings
   this.object3D.castShadow = true;
   this.object3D.receiveShadow = true;
   // Position
   this.object3D.position.x = position.x;
   this.object3D.position.y = position.y;
   this.object3D.position.z = position.z;

   // Dummy object
   this.addThing(0, 10, 0, 10, 10);
   var poleThickness = 2;
   var back = -50 + poleThickness/2;
   var front = 50 - poleThickness/2;
   var left = -50 + poleThickness/2;
   var right = 50 - poleThickness/2;
   this.addThing(left, 0, back, poleThickness, poleThickness);
   this.addThing(right, 0, back, poleThickness, poleThickness);
   this.addThing(right, 0, front, poleThickness, poleThickness);
   this.addThing(left, 0, front, poleThickness, poleThickness);

   return this;
};

// Getters

Arena.prototype.getObject3D = function() { return this.object3D; };

// Methods

Arena.prototype.addThing = function(x, y, z, width, depth) 
{
   var boxGeometry = new THREE.CubeGeometry(width, 10, depth);
   var boxMaterial = new THREE.MeshPhongMaterial({
      color: 0xff1111, 
      specular: 0xff0000, 
      shininess: 20, 
      morphTargets: true, 
      vertexColors: THREE.FaceColors, 
      shading: THREE.FlatShading
   });
   var box = new THREE.Mesh(boxGeometry, boxMaterial);
   // Settings
   box.castShadow = true;
   box.receiveShadow = true;
   // Position
   box.position.x = x;
   box.position.y = this.object3D.geometry.parameters.height / 2 + 10 / 2 + y;
   box.position.z = z;
   this.object3D.add(box);
};