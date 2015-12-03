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
   // this.addThing(0, 10, 0, 10, 10);
   var poleThickness = 4;
   var poleHeight = 14;
   var back = -50 + poleThickness/2;
   var front = 50 - poleThickness/2;
   var left = -50 + poleThickness/2;
   var right = 50 - poleThickness/2;
   this.addThing(left, 0, back, poleThickness, poleHeight, poleThickness, 0x2c3e50);
   this.addThing(right, 0, back, poleThickness, poleHeight, poleThickness, 0x2c3e50);
   this.addThing(right, 0, front, poleThickness, poleHeight, poleThickness, 0x2c3e50);
   this.addThing(left, 0, front, poleThickness, poleHeight, poleThickness, 0x2c3e50);

   // Ropes
   var ropeThickness = 1;
   // Left
   this.addThing(left, 2 * poleHeight/5, 0, ropeThickness, ropeThickness, 100 - 0.1, 0xc0392b);
   this.addThing(left, 3 * poleHeight/5, 0, ropeThickness, ropeThickness, 100 - 0.1, 0xc0392b);
   this.addThing(left, 4 * poleHeight/5, 0, ropeThickness, ropeThickness, 100 - 0.1, 0xc0392b);
   // Right
   this.addThing(right + 0, 2 * poleHeight/5, 0, ropeThickness, ropeThickness, 100 - 0.1, 0xc0392b);
   this.addThing(right + 0, 3 * poleHeight/5, 0, ropeThickness, ropeThickness, 100 - 0.1, 0xc0392b);
   this.addThing(right + 0, 4 * poleHeight/5, 0, ropeThickness, ropeThickness, 100 - 0.1, 0xc0392b);
   // Back
   this.addThing(0, 2 * poleHeight/5, back, 100 - 0.1, ropeThickness, ropeThickness, 0xc0392b);
   this.addThing(0, 3 * poleHeight/5, back, 100 - 0.1, ropeThickness, ropeThickness, 0xc0392b);
   this.addThing(0, 4 * poleHeight/5, back, 100 - 0.1, ropeThickness, ropeThickness, 0xc0392b);
   // Back
   this.addThing(0, 2 * poleHeight/5, front, 100 - 0.1, ropeThickness, ropeThickness, 0xc0392b, true);
   this.addThing(0, 3 * poleHeight/5, front, 100 - 0.1, ropeThickness, ropeThickness, 0xc0392b, true);
   this.addThing(0, 4 * poleHeight/5, front, 100 - 0.1, ropeThickness, ropeThickness, 0xc0392b, true);

   return this;
};

// Getters

Arena.prototype.getObject3D = function() { return this.object3D; };

// Methods

Arena.prototype.addThing = function(x, y, z, width, height, depth, color, transparent) 
{
   if (transparent != true) { 
      var transparent = false 
   }
   var boxGeometry = new THREE.CubeGeometry(width, height, depth);
   if (!transparent) {
      var boxMaterial = new THREE.MeshLambertMaterial({
         color: color, 
         specular: color, 
         shininess: 0, 
         morphTargets: true, 
         vertexColors: THREE.FaceColors, 
         shading: THREE.FlatShading
      });
   } else {
      var boxMaterial = new THREE.MeshPhongMaterial({
         color: color, 
         morphTargets: true, 
         vertexColors: THREE.FaceColors,
         transparent: true,
         opacity: 0.5
      });
   }
   
   var box = new THREE.Mesh(boxGeometry, boxMaterial);
   // Settings
   box.castShadow = true;
   box.receiveShadow = true;
   // Position
   box.position.x = x;
   box.position.y = this.object3D.geometry.parameters.height / 2 + height / 2 + y;
   box.position.z = z;
   this.object3D.add(box);
};

// Game

Arena.prototype.addPlayerCharacter = function(playerCharacter)
{
   /** create player character node */
   var playerCharacterNode = playerCharacter.getCollider().getNode();

   /** create healthbar genometry  */
   var healthY = this.getObject3D().geometry.parameters.height/2+ 800;
   
   if (this.player1 == undefined) {
      /** assign player character to player 1 */
      this.player1 = playerCharacter;
      /** set initial postion for player 1 */
      playerCharacterNode.position.x = -this.getObject3D().geometry.parameters.width/4;

      /** create healthbar geomotry for healthbar */
      var healthX = -this.getObject3D().geometry.parameters.width/2.5;

      /** initialize and assign healthbar to healthbar2 */
      var healthBar1 = new HealthBar().initWithSettings(healthX, healthY, 600, 70, 100);

      /** assign healthbar1 to player 1 */
      this.player1.setHealthBar(healthBar1);
      /** add healthbar1 to node */
      // this.getObject3D().add(healthBar1.getNode());
   } else {
      /** set player 2 as player character */
      this.player2 = playerCharacter;
      /** set initial position for player 2 */
      playerCharacterNode.position.x = this.getObject3D().geometry.parameters.width/4;
      /** set player 2 as enemy of player 1*/
      this.player1.setEnemy(this.player2);
      /** set player 1 as a enemy of player 2*/
      this.player2.setEnemy(this.player1);

      /** Create a geometry for healthbar */
      var healthX = this.getObject3D().geometry.parameters.width/2.5;
      /** initalize and assign the heathbar to healthbar2 */
      var healthBar2 = new HealthBar().initWithSettings(healthX, healthY, 600, 70, 100);
      /** assign healthbar2 to player 2*/
      this.player2.setHealthBar(healthBar2);
      /** add healthbar2 to node */
      // this.getObject3D().add(healthBar2.getNode());
   }
   
   this.getObject3D().add(playerCharacterNode);
};

/** 
* Update the status of player1 and player2 on each frame. 
*/
Arena.prototype.update = function()
{
   /** update player 1 character */
   if(this.player1.update() == 0)
   {
      this.player1 = null;
      this.player2 = null;
      // gameEngine.setGameState("P2Win");
      // gameEngine.addButton(new Button().initWithDimensions(0, 700, 700, 300, "Player 2 Wins","Fight"));
   }
   else /** update player 2 character */
   if(this.player2.update() == 0)
   {
      this.player1 = null;
      this.player2 = null;
      // gameEngine.setGameState("P1Win");
      // gameEngine.addButton(new Button().initWithDimensions(0, 700, 700, 300, "Player 1 Wins","Fight"));
   }
};