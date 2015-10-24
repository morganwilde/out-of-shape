function PlayerCharacter()
{
	// Size
	this.width;
	this.height;
	this.depth;
	// Key codes
	this.keyvalues;
	// Root of type Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D
	this.node;
}

// Initialisers

PlayerCharacter.prototype.initEmpty = function()
{
	// Size
	this.width = null;
	this.height = null;
	this.depth = null;
	// Root
	this.node = null;

  return this;
};

PlayerCharacter.prototype.initWithDimensions = function(width, height, depth)
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

PlayerCharacter.prototype.setKeys = function(jump, crouch, left, right, lightpunch, heavypunch, lightkick, heavykick, dash, block, grab)
{
	this.keyvalues['jump'] = jump;
	this.keyvalues['crouch'] = crouch;
	this.keyvalues['left'] = left;
	this.keyvalues['right'] = right;
	this.keyvalues['lightpunch'] = lightpunch;
	this.keyvalues['heavypunch'] = heavypunch;
	this.keyvalues['lightkick'] = lightkick;
	this.keyvalues['heavykick'] = heavykick;
	this.keyvalues['dash'] = dash;
	this.keyvalues['block'] = block;
	this.keyvalues['grab'] = grab;
};

// Getters

PlayerCharacter.prototype.getNode = function()
{
   return this.node;
};