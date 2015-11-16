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

	/** @property {float} width - The width of the Collider's Object3D.*/
	this.width;
	/** @property {float} height - The height of the Collider's Object3D.*/
	this.height;
	/** @property {float} depth - The depth of the Collider's Object3D.*/
	this.depth;
	
	// Root of type Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D

	/** @property {Object3D} node - The rendered polygon that represents the Collider instance.*/
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

	/** @property {boolean} isPlayer - The behavioural state of the Collider, either Player.*/
	this.isPlayer;
}

// Initialisers

/**
 * Creates a new instance of Collider. Motion values default to 0, all other values default to null.
 * 
 * @return {Collider} The Collider instance.
 */
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

/**
 * Creates a new instance of Collider with the given dimensions, owner, and isPlayer sentinal value.
 *
 * @param {float} width - The value for the width of the Collider's Object3d.
 * @param {float} height - The value for the height of the Collider's Object3d.
 * @param {float} depth - The value for the depth of the Collider's Object3d.
 * @param {PlayerCharacter} owner - The PlayerCharacter or HitBox that this Collider instance belongs to.
 * @param {boolean} isPlayer - The sentinal determining if this Collider is for a PlayerCharacter or a HitBox.
 * 
 * @return {Collider} The Collider instance.
 */
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

/**
* Returns an instance.
* @return {Object3D} The Object3D of the Collider.
*/
Collider.prototype.getNode = function()
{
   return this.node;
};

/**
* Returns a value.
* @return {float} The width used for the Object3D of the Collider.
*/
Collider.prototype.getWidth = function()
{
	return this.width;
}

/**
* Returns a value.
* @return {float} The height used for the Object3D of the Collider.
*/
Collider.prototype.getHeight = function()
{
	return this.height;
};

// Setters

/**
* Sets the x, y, and z position values of the Object3D.
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

/**
* Sets the horizontal velocity of the instance.
* @param {float} velocity - The value that the xVelocity will be set to.
*/
Collider.prototype.setXVelocity = function(velocity)
{
	this.xVelocity = velocity;
};

/**
* Sets the vertical velocity of the instance.
* @param {float} velocity - The value that the yVelocity will be set to.
*/
Collider.prototype.setYVelocity = function(velocity)
{
	this.yVelocity = velocity;
};

/**
* Sets the depth velocity of the instance.
* @param {float} velocity - The value that the zVelocity will be set to.
*/
Collider.prototype.setZVelocity = function(velocity)
{
	this.zVelocity = velocity;
};

/**
* Sets the gravity for the instance.
* @param {float} gravity - The value the gravity will be set to.
*/
Collider.prototype.setGravity = function(gravity)
{
	this.gravity = gravity;
};

/**
* Sets the instance that will be the enemy of this instance's player.
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
* @param {THREE.Vector3} hitPosition - The location of the HitBox that made contact.
*/
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

/**
* Prevents the instance from overlapping the enemy Collider.
*/
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

/**
* Prevents the instance from moving outside of the establish left and right boundaries of the arena, and from moving downward beyond the floor.
* The owner's characterState is set to "standing" if it is jumping and there is a collision with the floor.
*/
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

/**
* Checks for collision with another collider.
* @return {boolean} A boolean indicating if a collision has occured or not.
*/
Collider.prototype.checkCollision = function()
{
	return( this.checkVertexHit() || this.checkContain());
};

/**
* Checks if a raycast from any vertice of this instance's Object3D hits the enemy Collider's Object3D.
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
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
		{
			return true;
		}
	}

	return false;
};

/**
* Checks if this instance's Object3D is within the Enemy Collider's Object3D.
*
* @return {boolean} A boolean indicating if the Collider is within the enemy or not.
*/
Collider.prototype.checkContain = function() // checks if the center of the node is within the bounds of the enemy node, raycasts can't detect this kind of collision
{
	var worldPosition = new THREE.Vector3();
	worldPosition.setFromMatrixPosition( this.node.matrixWorld ); // get world coordinates

	return (Math.abs( worldPosition.x - this.enemy.getCollider().getNode().position.x)<this.width && Math.abs( worldPosition.y - this.enemy.getCollider().getNode().position.y)<this.height && Math.abs( worldPosition.z - this.enemy.getCollider().getNode().position.z)<this.depth);
};