function HitBox()
{	
	// Time
	this.beginTime;
	this.time;
	this.endTime;

	// Collision Box
	this.collider;

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
	// Time
	this.beginTime = 0;
	this.time = 0;
	this.endTime = 0;

	// Collision Box
	this.collider = null;

	// Opposing player character
	this.enemy = null;

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

	this.collider = new Collider().initWithSettings(width, height, depth, this, false); // the last parameter indicates whether the collider is for a PlayerCharacter or not
	

	this.active = false;
	this.isProjectile = false;

	return this;
};

HitBox.prototype.initAttack = function(command , character, enemy)
{
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
	
	this.enemy = enemy;
	this.collider.setEnemy(enemy);
};

HitBox.prototype.initStarStorm = function(character)
{	
	this.initWithDimensions(50,50,50);

	character.setActionFrames(95);

	character.getCollider().setXVelocity(0);

	this.owner = character;
	
	this.owner.getCollider().getNode().add(this.collider.getNode());
	
	var xstart = this.collider.getWidth()/2 + this.owner.getCollider().getWidth()/2;
	var ystart = 0;
	
	this.collider.setPosition(xstart, ystart, 0);

	this.beginTime = 15;

	this.endTime = 65;
	
	this.damage = 3;
}

HitBox.prototype.initStarShot = function(character)
{	
	this.initWithDimensions(50,50,50);

	character.setActionFrames(35);
	
	character.getCollider().setXVelocity(0);

	this.owner = character;
	
	gameEngine.arena.getRootObject().add(this.collider.getNode());
	this.isProjectile = true;
	
	var xstart = character.getCollider().getNode().position.x + this.collider.getWidth()/2;
	var ystart = character.getCollider().getNode().position.y;
	
	this.collider.setPosition(xstart, ystart, 0);
	
	this.collider.setXVelocity(10);

	this.beginTime = 15;

	this.endTime = 95;
	
	this.damage = 27;
}

// Getters

HitBox.prototype.getCollider = function()
{
   return this.collider;
};

// Methods

HitBox.prototype.update = function()
{
	this.collider.update();

	if(this.time == this.beginTime)
	{
		this.collider.getNode().material.color.setHex (0x00ff00); // attacks become green when they become active
		this.active = true;
	}

	if(this.time == this.endTime)
	{
		this.active = false;
		this.collider.getNode().material.color.setHex (0xaf00ff); // deactivated attacks (either due to collision or time) are purple
		
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

HitBox.prototype.onCollision = function()
{
	if( this.active == true && this.time >= this.beginTime)
	{
		this.active = false;
		this.collider.getNode().material.color.setHex (0xaf00ff); // deactivated attacks (either due to collision or time) are purple

		var worldPosition = new THREE.Vector3();
		worldPosition.setFromMatrixPosition( this.collider.getNode().matrixWorld ); // get world coordinates

		this.enemy.takeDamage(this.damage, worldPosition);
		this.collider.setXVelocity(0);
		
		if(this.isProjectile == true)
		{
			this.time = this.endTime - 3; // show the projectile for 3 frames after collision
		}
	}
};