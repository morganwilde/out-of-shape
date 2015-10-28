function HitBox()
{
	// Size
	this.width;
	this.height;
	this.depth;
	
	// Motion
	this.xVelocity;
	this.yVelocity;
	
	// Time
	this.beginTime;
	this.time;
	this.endTime;
	
	// Root of type Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D
	this.node;

	// Opposing player character
	this.enemy;

	// Owner of this hitbox
	this.owner;
}

// Initialisers

HitBox.prototype.initEmpty = function()
{
	// Size
	this.width = null;
	this.height = null;
	this.depth = null;
	
	// Motion
	this.xVelocity = null;
	this.yVelocity = null;
	
	// Time
	this.beginTime = 0;
	this.time = 0;
	this.endTime = 0;

	// Root
	this.node = null;
	
	// Owner of this hitbox
	this.owner = null;

  return this;
};

HitBox.prototype.initWithDimensions = function(width, height, depth)
{
	this.initEmpty();

	this.width = width;
	this.height = height;
	this.depth = depth;

	// Starting shape
	var geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
	var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
	this.node = new THREE.Mesh(geometry, material);

	return this;
};



HitBox.prototype.initAttack = function(command , character, enemy)
{
	this.enemy = enemy;

	if(command == "star storm")
	{
		this.initStarStorm(character);
	}
	
	if(command == "super kick")
	{
		this.superKick();
	}
};

HitBox.prototype.initStarStorm = function(character)
{	
	this.initWithDimensions(50,50,50);
	
	this.owner = character;
	
	this.owner.getNode().add(this.node);
	
	this.node.position.x+= 100;

	this.endTime = 65;
}

// Getters

HitBox.prototype.getNode = function()
{
   return this.node;
};

// Methods

HitBox.prototype.update = function()
{
	if(this.checkCollision())
	{
		this.owner.deleteHitBox(this);
	}

	this.node.position.x += this.xVelocity;
	this.node.position.y += this.yVelocity;
	
	this.time += 1;

	if(this.time == this.endTime)
	{
		this.owner.deleteHitBox(this);
	}
};

HitBox.prototype.checkCollision = function()
{
	return( this.checkContain() || this.checkEdgeHit());
};

HitBox.prototype.checkEdgeHit = function()
{
	var calcPosition, calcDirection;
	
	
	// top left corner of the HitBox
	calcPosition = new THREE.Vector3(this.node.position.x + this.node.parent.position.x - this.width/2, this.node.position.y + this.node.parent.position.y + this.height/2,0);

	calcDirection = this.getDirection( new THREE.Vector3(1, 0, 0 ) );	// raycast from the top left corner to the right
	if(this.checkRay(calcPosition, calcDirection))
	return true;

	calcDirection = this.getDirection( new THREE.Vector3(0, -1, 0 ) );	// raycast from the top left corner to the bottom
	if(this.checkRay(calcPosition, calcDirection))
	return true;
	
	// bottom left corner of the HitBox
	calcPosition = new THREE.Vector3(this.node.position.x + this.node.parent.position.x - this.width/2, this.node.position.y + this.node.parent.position.y - this.height/2,0);
	
	calcDirection = this.getDirection( new THREE.Vector3(1, 0, 0 ) );	// raycast from the bottom left corner to the right
	if(this.checkRay(calcPosition, calcDirection))
	return true;

	calcDirection = this.getDirection( new THREE.Vector3(0, 1, 0 ) );	// raycast from the bottom left corner to the top
	if(this.checkRay(calcPosition, calcDirection))
	return true;

	// top right corner of the HitBox
	calcPosition = new THREE.Vector3(this.node.position.x + this.node.parent.position.x + this.width/2, this.node.position.y + this.node.parent.position.y + this.height/2,0);
	
	calcDirection = this.getDirection( new THREE.Vector3(-1, 0, 0 ) );	// raycast from the top right corner to the left
	if(this.checkRay(calcPosition, calcDirection))
	return true;

	calcDirection = this.getDirection( new THREE.Vector3(0, -1, 0 ) );	// raycast from the top right corner to the bottom
	if(this.checkRay(calcPosition, calcDirection))
	return true;

	// bottom right corner of the HitBox
	calcPosition = new THREE.Vector3(this.node.position.x + this.node.parent.position.x + this.width/2, this.node.position.y + this.node.parent.position.y - this.height/2,0);

	calcDirection = this.getDirection( new THREE.Vector3(-1, 0, 0 ) );	// raycast from the bottom right corner to the left
	if(this.checkRay(calcPosition, calcDirection))
	return true;

	calcDirection = this.getDirection( new THREE.Vector3(0, 1, 0 ) );	// raycast from the bottom right corner to the top
	if(this.checkRay(calcPosition, calcDirection))
	return true;

	return false;
};

HitBox.prototype.getDirection = function(direction)
{
	var matrix = new THREE.Matrix4();
	matrix.extractRotation( this.node.matrix );

	return direction.applyMatrix4( matrix );
};

HitBox.prototype.checkRay = function(position, direction) // check the ray at the pre-calculated position and direction
{
	var raycaster = new THREE.Raycaster();
	
	raycaster.set(position, direction);
	var intersects = raycaster.intersectObject( this.enemy.getNode(), true );

	return (intersects.length>0 && intersects[0].distance<this.width); // this presumes that all hit boxes have equal wifth and height
};

HitBox.prototype.checkContain = function() // checks if the center of the node is within the bounds of the enemy node, raycasts can't detect this kind of collision
{
	var worldX = this.node.parent.position.x + this.node.position.x;
	var enemyInner = this.enemy.getNode().position.x - this.enemy.getWidth()/2;
	var enemyOuter = this.enemy.getNode().position.x + this.enemy.getWidth()/2;
	
	var worldY = this.node.parent.position.y + this.node.position.y;
	var enemyUpper = this.enemy.getNode().position.y + this.enemy.getHeight()/2;
	var enemyLower = this.enemy.getNode().position.y - this.enemy.getHeight()/2;
	
	return (worldX>enemyInner && worldX<enemyOuter && worldY<enemyUpper && worldY>enemyLower);
};