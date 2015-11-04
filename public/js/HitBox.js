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
	this.isProjectile;
	
	this.damage;
	
	this.active;
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
	this.isProjectile = null;
	
	this.damage = null;
	
	this.active = null;

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
	var material = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.node = new THREE.Mesh(geometry, material);
	
	this.active = false;
	this.isProjectile = false;

	return this;
};



HitBox.prototype.initAttack = function(command , character, enemy)
{
	this.enemy = enemy;

	if(command == "star storm")
	{
		this.initStarStorm(character);
	}
	
	if(command == "star shot")
	{
		this.initStarShot(character);
	}
	
	if(command == "super kick")
	{
		this.superKick();
	}
};

HitBox.prototype.initStarStorm = function(character)
{	
	this.initWithDimensions(50,50,50);

	character.setActionFrames(95);

	character.setXVelocity(0);

	this.owner = character;
	
	this.owner.getNode().add(this.node);
	
	this.node.position.x+= 100;

	this.beginTime = 15;

	this.endTime = 65;
	
	this.damage = 3;
}

HitBox.prototype.initStarShot = function(character)
{	
	this.initWithDimensions(50,50,50);

	character.setActionFrames(35);
	
	character.setXVelocity(0);

	this.owner = character;
	
	gameEngine.arena.getRootObject().add(this.node);
	this.isProjectile = true;
	
	this.node.position.x = character.getNode().position.x + 100;
	this.node.position.y = character.getNode().position.y;
	
	this.xVelocity = 10;

	this.beginTime = 15;

	this.endTime = 95;
	
	this.damage = 2;
}

// Getters

HitBox.prototype.getNode = function()
{
   return this.node;
};

// Methods

HitBox.prototype.update = function()
{
	if(this.checkCollision() && this.active)
	{
		this.active = false;
		this.node.material.color.setHex (0xaf00ff); // deactivated attacks (either due to collision or time) are purple

		var worldPosition = new THREE.Vector3();
		worldPosition.setFromMatrixPosition( this.node.matrixWorld ); // get world coordinates

		this.enemy.takeDamage(this.damage, worldPosition);
		
		if(this.isProjectile == true)
		{
			this.time = this.endTime - 3; // show the projectile for 3 frames after collision
		}
	}

	this.node.position.x += this.xVelocity;
	this.node.position.y += this.yVelocity;

	if(this.time == this.beginTime)
	{
		this.node.material.color.setHex (0x00ff00); // attacks become green when they become active
		this.active = true;
	}

	if(this.time == this.endTime)
	{
		this.active = false;
		this.node.material.color.setHex (0xaf00ff); // deactivated attacks (either due to collision or time) are purple
		
		if(this.isProjectile)
		{
			this.owner.deleteHitBox(this);
		}
	}
	
	this.time += 1;
	
	if(this.owner.getActionFrames() == 0 && this.isProjectile == false)
	{
		this.owner.deleteHitBox(this);
	}
};

HitBox.prototype.checkCollision = function()
{
	return( this.checkVertexHit() || this.checkContain());
};

// *** modified from https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
HitBox.prototype.checkVertexHit = function()
{
	var originPoint = new THREE.Vector3();
	originPoint.setFromMatrixPosition( this.node.matrixWorld ); // get world coordinates
	
	for (var vertexIndex = 0; vertexIndex < this.node.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = this.node.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( this.node.matrix );
		var directionVector = globalVertex.sub( this.node.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObject( this.enemy.node , true);
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
		{
			return true;
		}
	}

	return false;
};
// ***

HitBox.prototype.checkContain = function() // checks if the center of the node is within the bounds of the enemy node, raycasts can't detect this kind of collision
{
	var worldPosition = new THREE.Vector3();
	worldPosition.setFromMatrixPosition( this.node.matrixWorld ); // get world coordinates
		
	return (Math.abs( worldPosition.x - this.enemy.getNode().position.x)<this.width && Math.abs( worldPosition.y - this.enemy.getNode().position.y)<this.height && Math.abs( worldPosition.z - this.enemy.getNode().position.z)<this.depth);
};