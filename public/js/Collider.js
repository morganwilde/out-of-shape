function Collider()
{
	// Owner -- PlayerCharacter or HitBox instance that uses this collider for its bounds
	this.owner;

	// Size
	this.width;
	this.height;
	this.depth;
	
	// Root of type Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D
	this.node;
	
	// Opposing player character
	this.enemy;
	
	// Motion
	this.xVelocity;
	this.yVelocity;
	this.zVelocity;
	this.gravity;
	
	// Behaviour Sentinel
	this.isPlayer;
}

// Initialisers

Collider.prototype.initEmpty = function()
{
	// Owner -- PlayerCharacter or HitBox instance that uses this collider for its bounds
	this.owner = null;

	// Size
	this.width = null;
	this.height = null;
	this.depth = null;
	
	// Root of type Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D
	this.node = null;
	
	// Motion
	this.xVelocity = 0;
	this.yVelocity = 0;
	this.zVelocity = 0;
	this.gravity = 0;
	
	// Behaviour Sentinel
	this.isPlayer = null;

	return this;
};

Collider.prototype.initWithSettings = function(width, height, depth, owner, isPlayer)
{
	this.initEmpty();

	this.width = width;
	this.height = height;
	this.depth = depth;

	this.owner = owner;
	this.isPlayer = isPlayer;

	// Starting shape
	var geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
	var material = new THREE.MeshPhongMaterial({
		color: 0x0000ff, 
		//side: THREE.DoubleSide, 
		wireframe: false,
		specular: 0x000000, 
		shininess: 0, 
		shading: THREE.FlatShading
	});
	
	if(this.isPlayer == false)
	{
		material.color.setHex(0x00afaf);
	}

	this.node = new THREE.Mesh(geometry, material);

	return this;
};

// Getters

Collider.prototype.getNode = function()
{
   return this.node;
};

Collider.prototype.getWidth = function()
{
	return this.width;
}

Collider.prototype.getHeight = function()
{
	return this.height;
};

// Setters

Collider.prototype.setPosition = function(x, y, z)
{
	this.node.position.x = x;
	this.node.position.y = y;
	this.node.position.z = z;
};

Collider.prototype.setXVelocity = function(velocity)
{
	this.xVelocity = velocity;
};

Collider.prototype.setYVelocity = function(velocity)
{
	this.yVelocity = velocity;
};

Collider.prototype.setZVelocity = function(velocity)
{
	this.zVelocity = velocity;
};

Collider.prototype.setGravity = function(gravity)
{
	this.gravity = gravity;
};

Collider.prototype.setEnemy = function(enemy)
{
	this.enemy = enemy;
}

// Methods

Collider.prototype.update = function()
{
	if(this.checkCollision())
	{
		if(this.isPlayer == true)
		{
			this.enforcePlayerBounds();
		}
		else
		{
			this.owner.onCollision();
		}
	}

	this.node.position.x += this.xVelocity;

	this.node.position.y += this.yVelocity;

	this.node.position.z += this.zVelocity;

	this.yVelocity -= this.gravity;

	if(this.isPlayer == true)
	{
		this.enforceLevelBounds();
	}

};

Collider.prototype.bump = function(hitPosition)
{
	var bumpDistance = 15;

	if(this.node.position.x > hitPosition.x)
	{
		this.node.position.x += bumpDistance;
	}
	else
	{
		this.node.position.x -= bumpDistance;
	}
}

Collider.prototype.enforcePlayerBounds = function()
{
	var slidespeed = 10;

	if((this.xVelocity>0 && this.node.position.x > this.enemy.getCollider().getNode().position.x) || (this.xVelocity < 0 && this.node.position.x < this.enemy.getCollider().getNode().position.x)) // removing  this.xVelocity < 0  allows passing through
		{
			this.node.position.x += this.xVelocity;
		}
		else
		{
			this.node.position.x -= this.xVelocity;
		}
		
		if(this.node.position.y > this.enemy.getCollider().getNode().position.y && this.yVelocity < 0)
		{
			this.yVelocity = 0;//this.jumpSpeed;

			if(this.node.position.x>=this.enemy.getCollider().node.position.x)
			this.xVelocity = slidespeed;
			else
			this.xVelocity = -slidespeed;
		}
};

Collider.prototype.enforceLevelBounds = function()
{
	// right bound
	if(this.node.position.x > gameEngine.arena.getRootObject().geometry.parameters.width/2-this.width/2)
	{
		this.node.position.x = gameEngine.arena.getRootObject().geometry.parameters.width/2-this.width/2;
	}

	// left bound
	if(this.node.position.x < -gameEngine.arena.getRootObject().geometry.parameters.width/2+this.width/2)
	{
		this.node.position.x = -gameEngine.arena.getRootObject().geometry.parameters.width/2+this.width/2;
	}

	// floor bounds falling
	if(this.node.position.y <= gameEngine.arena.getRootObject().geometry.parameters.height/2+this.height/2)
	{
		this.node.position.y = gameEngine.arena.getRootObject().geometry.parameters.height/2+this.height/2;
		
		if(this.yVelocity < 0)
		{
			this.yVelocity = 0;
		}

		var characterState = this.owner.getCharacterState();

		if(characterState  == "jumping" )
		{
			this.owner.setCharacterState("standing");
		}

		if(characterState == "initBlocking" || characterState == "blocking")
		{
			this.xVelocity = 0;
		}
	
	}
};

Collider.prototype.checkCollision = function()
{
	return( this.checkVertexHit() || this.checkContain());
};

// *** modified from https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
Collider.prototype.checkVertexHit = function()
{
	var originPoint = new THREE.Vector3();
	originPoint.setFromMatrixPosition( this.node.matrixWorld ); // get world coordinates
	
	for (var vertexIndex = 0; vertexIndex < this.node.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = this.node.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( this.node.matrix );
		var directionVector = globalVertex.sub( this.node.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObject( this.enemy.getCollider().getNode() , false);
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
		{
			return true;
		}
	}

	return false;
};
// ***

Collider.prototype.checkContain = function() // checks if the center of the node is within the bounds of the enemy node, raycasts can't detect this kind of collision
{
	var worldPosition = new THREE.Vector3();
	worldPosition.setFromMatrixPosition( this.node.matrixWorld ); // get world coordinates

	return (Math.abs( worldPosition.x - this.enemy.getCollider().getNode().position.x)<this.width && Math.abs( worldPosition.y - this.enemy.getCollider().getNode().position.y)<this.height && Math.abs( worldPosition.z - this.enemy.getCollider().getNode().position.z)<this.depth);
};