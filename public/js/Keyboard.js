function Keyboard()
{
	// Frame window for button Press
	this.buffertime;
	
	this.keyvalue;
}

// Initialisers

Keyboard.prototype.initEmpty = function()
{
    // Size
    this.width = null;
    this.height = null;
    this.depth = null;
    // Root
    this.node = null;

    //Movement properties
    this.walkspeed = 4; //speed of horizontal movement
    this.runspeed = 10; // additional horizontal speed when the run button is held
    this.jumpspeed = 30;
    this.yvelocity = 0;
    this.gravity = 2;

  return this;
};

Keyboard.prototype.initWithKeys = function(width, height, depth)
{
   this.initEmpty();

   this.width = width;
   this.height = height;
   this.depth = depth;

   // Starting shape
   var geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
   var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
   this.node = new THREE.Mesh(geometry, material);
   
   return this;
};

// Getters

PlayerCharacter.prototype.getNode = function()
{
   return this.node;
};