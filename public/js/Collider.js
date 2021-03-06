/**
 * Class responsible for detecting collisions between 3d objects (for PlayerCharacters and HitBoxes).
 *
 * @constructor
 */
function Collider()
{
	// Owner -- PlayerCharacter or HitBox instance that uses this collider for its bounds

	/** @property {PlayerCharacter} owner - The PlayerCharacter or HitBox instance that this Collider belongs to.*/
	this.owner;

	// Size

	/** @property {float} width - The width of the Collider's THREE.Object3D.*/
	this.width;
	/** @property {float} height - The height of the Collider's THREE.Object3D.*/
	this.height;
	/** @property {float} depth - The depth of the Collider's THREE.Object3D.*/
	this.depth;
	
	// Root of type THREE.Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D

	/** @property {THREE.Object3D} node - The rendered polygon that represents the Collider instance.*/
	this.node;
	
	// Opposing player character

	/** @property {PlayerCharacter} enemy - The PlayerCharacter that is not the owner of this Collider instance.*/
	this.enemy;
	
	// Motion

	/** @property {float} xVelocity - The horizontal motion of this Collider instance.*/
	this.xVelocity;
	/** @property {float} yVelocity - The vertical motion of this Collider instance.*/
	this.yVelocity;
	/** @property {float} zVelocity - The depth motion of this Collider instance.*/
	this.zVelocity;
	/** @property {float} gravity - The rate at which the yVelocity is decreased per call of the update method.*/
	this.gravity;
	
	// Behaviour Sentinel

	/** @property {boolean} isPlayer - The behavioural state of the Collider, either for a PlayerCharacter or a HitBox.*/
	this.isPlayer;

	this.arena;
}

// Initialisers

/**
 * Creates a new instance of a Collider. Motion variables default to 0, all other instance variables default to null.
 * 
 * @return {Collider} A Collider instance.
 */
Collider.prototype.initEmpty = function()
{
	// Owner -- PlayerCharacter or HitBox instance that uses this collider for its bounds
	this.owner = null;

	// Size
	this.width = null;
	this.height = null;
	this.depth = null;
	
	// Root of type THREE.Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D
	this.node = null;
	
	// Motion
	this.xVelocity = 0;
	this.yVelocity = 0;
	this.zVelocity = 0;
	this.xRotationSpeed = 0;
	this.yRotationSpeed = 0;
	this.zRotationSpeed = 0;
	this.gravity = 0;
	
	// Behaviour Sentinel
	this.isPlayer = null;
	this.arena = null;

	return this;
};

/**
 * Creates a new instance of Collider with the given dimensions, owner, and isPlayer sentinal value.
 *
 * @param {float} width - The value for the width of the Collider's THREE.Object3D.
 * @param {float} height - The value for the height of the Collider's THREE.Object3D.
 * @param {float} depth - The value for the depth of the Collider's THREE.Object3D.
 * @param {PlayerCharacter} owner - The PlayerCharacter or HitBox that this Collider instance belongs to.
 * @param {boolean} isPlayer - The sentinal determining if this Collider is for a PlayerCharacter or a HitBox.
 * 
 * @return {Collider} A Collider instance.
 */
Collider.prototype.initWithSettings = function(width, height, depth, owner, isPlayer, arena)
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
		shading: THREE.FlatShading,
		transparent: isPlayer,
		opacity: 0
	});

	this.node = new THREE.Mesh(geometry, material);

	if (this.isPlayer == false) {
		material.color.setHex(0x00afaf);

		//prevent scale of player from affecting scale of hitboxes. Collision detection works fine based on internal scale, but not with inherited scaling.
		this.node.scale.x = 1/this.owner.getOwner().getCollider().getNode().scale.x;
		this.node.scale.y = 1/this.owner.getOwner().getCollider().getNode().scale.y;
		this.node.scale.z = 1/this.owner.getOwner().getCollider().getNode().scale.z;
	}

	this.arena = arena;

	return this;
};

// Getters

/**
* Returns the polygon (THREE.Object3D) of this instance.
* 
* @return {THREE.Object3D} A THREE.Object3D instance.
*/
Collider.prototype.getNode = function()
{
   return this.node;
};

/**
* Returns the width of this instance's THREE.Object3D.
* 
* @return {float} The width used for the THREE.Object3D of the Collider.
*/
Collider.prototype.getWidth = function()
{
	return this.width * this.node.scale.x;
}

/**
* Returns the height of this instance's THREE.Object3D.
* 
* @return {float} The height used for the THREE.Object3D of the Collider.
*/
Collider.prototype.getHeight = function()
{
	return this.height * this.node.scale.y;
};

// Setters

/**
* Sets the x, y, and z position values of the THREE.Object3D.
* 
* @param {float} x - The value that the x position of the node will be set to.
* @param {float} y - The value that the y position of the node will be set to.
* @param {float} z - The value that the z position of the node will be set to.
*/
Collider.prototype.setPosition = function(x, y, z)
{
	this.node.position.x = x;
	this.node.position.y = y;
	this.node.position.z = z;
};

Collider.prototype.setRelativePosition = function(x, y, z)
{
	this.node.position.x += x;
	this.node.position.y += y;
	this.node.position.z += z;
};

Collider.prototype.setRotation = function(x, y, z)
{
	this.node.rotation.x = x;
	this.node.rotation.y = y;
	this.node.rotation.z = z;
};

/**
* Sets the horizontal velocity of the instance.
* 
* @param {float} velocity - The value that the xVelocity will be set to.
*/
Collider.prototype.setXVelocity = function(velocity)
{
	this.xVelocity = velocity;
};

/**
* Sets the vertical velocity of the instance.
* 
* @param {float} velocity - The value that the yVelocity will be set to.
*/
Collider.prototype.setYVelocity = function(velocity)
{
	this.yVelocity = velocity;
};

/**
* Sets the depth velocity of the instance.
* 
* @param {float} velocity - The value that the zVelocity will be set to.
*/
Collider.prototype.setZVelocity = function(velocity)
{
	this.zVelocity = velocity;
};

Collider.prototype.setXRotationSpeed = function(rspeed)
{
	this.xRotationSpeed = rspeed;
};

Collider.prototype.setYRotationSpeed = function(rspeed)
{
	this.yRotationSpeed = rspeed;
};

Collider.prototype.setZRotationSpeed = function(rspeed)
{
	this.zRotationSpeed = rspeed;
};


/**
* Sets the gravity for the instance.
* 
* @param {float} gravity - The value the gravity will be set to.
*/
Collider.prototype.setGravity = function(gravity)
{
	this.gravity = gravity;
};

/**
* Sets the instance that will be the enemy of this instance's player.
* 
* @param {PlayerCharacter} enemy - The PlayerCharacter that will be set as the enemy.
*/
Collider.prototype.setEnemy = function(enemy)
{
	this.enemy = enemy;
}

// Methods

/**
* Manages the run-time execution of fundamental featues like motion and collision.
*/
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

	this.node.rotation.x += this.xRotationSpeed;

	this.node.rotation.y += this.yRotationSpeed;

	this.node.rotation.z += this.zRotationSpeed;

	this.node.position.x += this.xVelocity;

	this.node.position.y += this.yVelocity;

	this.node.position.z += this.zVelocity;

	this.yVelocity -= this.gravity;

	if(this.isPlayer == true)
	{
		this.enforceLevelBounds();
	}

};

/**
* Moves the instance a small distance away from a given HitBox position.
* 
* @param {THREE.Vector3} hitPosition - The location of the HitBox that made contact.
*/
Collider.prototype.bump = function(hitPosition)
{
	var bumpDistance = 3;

	if(this.node.position.x > hitPosition.x)
	{
		this.node.position.x += bumpDistance;
	}
	else
	{
		this.node.position.x -= bumpDistance;
	}
}

/**
* Prevents the instance from overlapping with the enemy Collider.
*/
Collider.prototype.enforcePlayerBounds = function()
{
	var slidespeed = 1;

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

/**
* Prevents the instance from moving outside of the established left and right boundaries of the Arena, and from moving downward beyond the floor (top surface of the Arena).
* The owner's characterState is set to "standing" if it is jumping and there is a collision with the floor.
*/
Collider.prototype.enforceLevelBounds = function()
{
	// right bound
	if(this.node.position.x > this.arena.getObject3D().geometry.parameters.width/2-this.width/2 * this.node.scale.x)
	{
		this.node.position.x = this.arena.getObject3D().geometry.parameters.width/2-this.width/2 * this.node.scale.x;
	}

	// left bound
	if(this.node.position.x < -this.arena.getObject3D().geometry.parameters.width/2+this.width/2 * this.node.scale.x)
	{
		this.node.position.x = -this.arena.getObject3D().geometry.parameters.width/2+this.width/2 * this.node.scale.x;
	}

	// floor bounds falling
	if(this.node.position.y <= this.arena.getObject3D().geometry.parameters.height/2+this.height/2 * this.node.scale.y)
	{
		this.node.position.y = this.arena.getObject3D().geometry.parameters.height/2+this.height/2 * this.node.scale.y;
		
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

/**
* Checks for collision with the enemy's Collider.
* 
* @return {boolean} A boolean indicating if a collision has occured or not.
*/
Collider.prototype.checkCollision = function()
{
	return( this.checkVertexHit() || this.checkContain());
};

/**
* Checks if a raycast from any vertice of this instance's THREE.Object3D hits the enemy Collider's THREE.Object3D.
* 
* @return {boolean} A boolean indicating if any of the raycasts have collided with an enemy.
*/
Collider.prototype.checkVertexHit = function()
{
	// modified from https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html

	var originPoint = new THREE.Vector3();
	originPoint.setFromMatrixPosition( this.node.matrixWorld ); // get world coordinates
	
	for (var vertexIndex = 0; vertexIndex < this.node.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = this.node.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( this.node.matrix );
		var directionVector = globalVertex.sub( this.node.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObject( this.enemy.getCollider().getNode() , false);
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() * this.node.scale.y ) 
		{
			return true;
		}
	}

	return false;
};

/**
* Checks if this instance's THREE.Object3D is within the Enemy Collider's THREE.Object3D.
*
* @return {boolean} A boolean indicating if this Collider is within the enemy's Collider bounds or not.
*/
Collider.prototype.checkContain = function() // checks if the center of the node is within the bounds of the enemy node, raycasts can't detect this kind of collision
{
	var worldPosition = new THREE.Vector3();
	worldPosition.setFromMatrixPosition( this.node.matrixWorld ); // get world coordinates

	return (Math.abs( worldPosition.x - this.enemy.getCollider().getNode().position.x)<this.width * this.node.scale.x && Math.abs( worldPosition.y - this.enemy.getCollider().getNode().position.y)<this.height * this.node.scale.y && Math.abs( worldPosition.z - this.enemy.getCollider().getNode().position.z)<this.depth * this.node.scale.z);
};