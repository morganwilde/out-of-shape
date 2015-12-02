function VertexCollection()
{
   // Vertex Array
   this.collection;
   this.drawnCollection;
   this.targetObject3D;
}

// Statics

VertexCollection.VertexProjectionSideLength = Engine.relativeSizingBase * 0.02; // 2% of the Arena's width

// Initialisers

VertexCollection.prototype.initEmpty = function()
{
   this.collection = null;
   this.drawnCollection = null;
   this.targetObject3D = null;
   return this;
};

VertexCollection.prototype.initWithObject3DBox = function(box)
{
   this.initEmpty();

   this.targetObject3D = null;

   // A box has 8 vertices
   var left = -box.geometry.parameters.width/2;
   var right = -left;
   var top = box.geometry.parameters.height/2;
   var bottom = -top;
   var front = box.geometry.parameters.depth/2;
   var back = -front;

   this.collection = [
      // Front
      new THREE.Vector3(left, top, front),
      new THREE.Vector3(right, top, front),
      new THREE.Vector3(right, bottom, front),
      new THREE.Vector3(left, bottom, front),
      // Back
      new THREE.Vector3(left, top, back),
      new THREE.Vector3(right, top, back),
      new THREE.Vector3(right, bottom, back),
      new THREE.Vector3(left, bottom, back)
   ];

   for (var i = this.collection.length - 1; i >= 0; i--) {
      this.collection[i].add(box.position);
   };

   this.drawnCollection = [];

   return this;
};

// Methods for Drawing

VertexCollection.prototype.drawOntoObject3D = function(object3D)
{
   var length = VertexCollection.VertexProjectionSideLength;
   this.targetObject3D = object3D;

   for (var i = this.collection.length - 1; i >= 0; i--) {
      // Shape
      var geometry = new THREE.CubeGeometry(length, length, length);
      var material = new THREE.MeshPhongMaterial({
         color: 0x1111ff, 
         specular: 0xff0000,
      });
      var vertex = new THREE.Mesh(geometry, material);

      // Positioning
      vertex.position.add(this.collection[i]);
      object3D.add(vertex);
      this.drawnCollection.push(vertex);
   };
};

VertexCollection.prototype.eraseFromTargetObject3D = function()
{
   for (var i = this.drawnCollection.length - 1; i >= 0; i--) {
      this.targetObject3D.remove(this.drawnCollection[i]);
   };
};

VertexCollection.prototype.drawOntoDOMElementWithIdUsingCamera = function(elementID, camera)
{
   var element = document.querySelector('#' + elementID);
   var width = element.getBoundingClientRect().width;
   var height = element.getBoundingClientRect().height;

   for (var i = this.collection.length - 1; i >= 0; i--) {
      // Get 2D coordinates
      var vertexProjection = this.collection[i].clone().project(camera);
      var x = vertexProjection.x * width/2 + width/2;
      var y = -vertexProjection.y * height/2 + height/2;

      // Put them in the DOM structure
      var pointerElement = document.createElement('div');
      pointerElement.classList.add('pointer');
      pointerElement.style.top = (y - 5) + 'px';
      pointerElement.style.left = (x - 5) + 'px';
      element.appendChild(pointerElement);
   };
};

VertexCollection.prototype.drawOntoDOMElementWithIdBoundingBoxUsingCamera = function(elementID, camera)
{
   var element = document.querySelector('#' + elementID);
   var width = element.getBoundingClientRect().width;
   var height = element.getBoundingClientRect().height;

   // Bounding box corners
   var xMin = null;
   var xMax = null;
   var yMin = null;
   var yMax = null;

   for (var i = this.collection.length - 1; i >= 0; i--) {
      // Get 2D coordinates
      var vertexProjection = this.collection[i].clone().project(camera);
      var x = vertexProjection.x * width/2 + width/2;
      var y = -vertexProjection.y * height/2 + height/2;

      // Determine the bounding box
      if (x < xMin || xMin == null) {
         xMin = x;
      }
      if (x > xMax || xMax == null) {
         xMax = x;
      }
      if (y < yMin || yMin == null) {
         yMin = y;
      }
      if (y > yMax || yMax == null) {
         yMax = y;
      }
   };

   xMin = Math.round(xMin);
   xMax = Math.round(xMax);
   yMin = Math.round(yMin);
   yMax = Math.round(yMax);

   // Bounding box
   var boundingElement = document.createElement('div');
   boundingElement.classList.add('bounding');
   boundingElement.style.top = yMin + 'px';
   boundingElement.style.left = xMin + 'px';
   boundingElement.style.width = (xMax - xMin) + 'px';
   boundingElement.style.height = (yMax - yMin) + 'px';
   element.appendChild(boundingElement);
};