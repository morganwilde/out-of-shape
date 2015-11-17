/**
* The purpose of the HitBox class is to define dimmensions for itself, handle initial and ending velocities and time. It stores references to a Collider box and the two PlayerCharacters, as well as defining the type and damage of the attack.
*
* @constructor
*/
function HitBox()
{	
	/** @property {Integer} beginTime Begin time */
	this.beginTime;
	/** @property {Integer} duration Duration */
	this.time;
	/** @property {Integer} endTime End time */
	this.endTime;

	/** @property {Collider} collider Collision Box */
	this.collider;

	/** @property {PlayerCharacter} enemy Opposing character */
	this.enemy;

	/** @property {PlayerCharacter} owner Owner of the hitbox */
	this.owner;
	/** @property {String} attackType Attack type */
	this.attackType;

	/** @property {Float} initialXVelocity Intial X velocity */
	this.initialXVelocity;
	/** @property {Float} initialYVelocity Intial Y velocity */
	this.initialYVelocity;
	/** @property {Float} initialZVelocity Intial Z velocity */
	this.initialZVelocity;
	/** @property {Float} endingXVelocity Ending X velocity */
	this.endingXVelocity;
	/** @property {Float} endingYVelocity Ending Y velocity */
	this.endingYVelocity;
	/** @property {Float} endingZVelocity Ending Z velocity */
	this.endingZVelocity;
	/** @property {Integer} damage The amount of damage that this HitBox deals. */
	this.damage;
	/** @property {Boolean} active If the HitBox is active then collisions are triggered. */
	this.active;
}


/**
* Constructor of the HitBox class, set everything to null.
*/
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
	this.attackType = null;

	// Motion
	this.initialXVelocity = 0;
	this.initialYVelocity = 0;
	this.initialZVelocity = 0;
	this.endingXVelocity = 0;
	this.endingYVelocity = 0;
	this.endingZVelocity = 0;

	this.damage = null;
	
	this.active = null;

  return this;
};
/** Constructor for the HitBox dimensions.

* @param {Integer} width - Width of the HitBox.
* @param {Integer} height - Height of the HitBox.
* @param {Integer} depth - Depth of the HitBox.
* 
* @return {HitBox} A HitBox instance.
*/
HitBox.prototype.initWithDimensions = function(width, height, depth)
{
	this.initEmpty();

	this.collider = new Collider().initWithSettings(width, height, depth, this, false); // the last parameter indicates whether the collider is for a PlayerCharacter or not
	

	this.active = false;
	this.attackType = "melee";

	return this;
};

/**
* Create a HitBox instance using a specified command.
* 
* @param {string} command Name of the attack type.
* @param {PlayerCharacter} character The PlayerCharacter that initializes the attack. 
* @param {PlayerCharacter} enemy The target PlayerCharacter.
*/

HitBox.prototype.initAttack = function(command, character, enemy)
{
	if(command == "star storm")
	{
		this.initStarStorm(character);
	}
	
	if(command == "star shot")
	{
		this.initStarShot(character);
	}

	if(command == "grab")
	{
		this.initGrab(character);
	}
	
	this.enemy = enemy;
	this.collider.setEnemy(enemy);
};

/**
* Create a HitBox instance for a specific PlayerCharacter class.
* 
* @param {PlayerCharacter} character The PlayerCharacter that initializes the attack.
*/
HitBox.prototype.initStarStorm = function(character)
{	
	this.initWithDimensions(50,50,50);

	character.setActionFrames(30);

	character.getCollider().setXVelocity(0);

	this.owner = character;
	
	this.owner.getCollider().getNode().add(this.collider.getNode());
	this.attackType = "melee";
	
	var xstart = this.collider.getWidth()/2 + this.owner.getCollider().getWidth()/2;
	var ystart = 0;
	
	this.collider.setPosition(xstart, ystart, 0);

	this.beginTime = 5;

	this.endTime = 15;
	
	this.damage = 20;
}

/**
* Create a HitBox instance for a specific PlayerCharacter class, this attack is a projectile.
* @param {PlayerCharacter} character The PlayerCharacter that initializes the attack.
*/

HitBox.prototype.initStarShot = function(character)
{	
	this.initWithDimensions(50,50,50);

	character.setActionFrames(35);
	
	character.getCollider().setXVelocity(0);

	this.owner = character;
	
	gameEngine.arena.getRootObject().add(this.collider.getNode());
	this.attackType = "projectile";
	
	var xstart = character.getCollider().getNode().position.x + this.collider.getWidth()/2;
	var ystart = character.getCollider().getNode().position.y;
	
	this.collider.setPosition(xstart, ystart, 0);

	this.initialXVelocity = 10;

	this.beginTime = 15;

	this.endTime = 95;
	
	this.damage = 2;
}
/**
* Create a HitBox instance for a specific PlayerCharacter class, this attack is a grab.
* @param {PlayerCharacter} character The PlayerCharacter that initializes the attack.
*/ 
HitBox.prototype.initGrab = function(character)
{	
	this.initWithDimensions(50,50,50);

	character.setActionFrames(95);

	character.getCollider().setXVelocity(0);

	this.owner = character;
	
	this.owner.getCollider().getNode().add(this.collider.getNode());
	this.attackType = "grab";
	
	var xstart = this.collider.getWidth()/2 + this.owner.getCollider().getWidth()/2;
	var ystart = 0;
	
	this.collider.setPosition(xstart, ystart, 0);

	this.beginTime = 15;

	this.endTime = 65;
	
	this.damage = 20;
}

/**
* Returns the Collider instance that belongs to this HitBox.
* 
* @return {Collider} This HitBox's Collider.
*/
HitBox.prototype.getCollider = function()
{
   return this.collider;
};

/**
* Update the Collider instance of this HitBox, manage the timing, motion patterns and states of this HitBox.
*/

HitBox.prototype.update = function()
{
	this.collider.update();

	if(this.time == this.beginTime)
	{
		/** attack become green if they are active */
		this.collider.getNode().material.color.setHex (0x00ff00);
		this.collider.setXVelocity(this.initialXVelocity);
		this.collider.setYVelocity(this.initialYVelocity);
		this.collider.setZVelocity(this.initialZVelocity);
		this.active = true;
	}

	if(this.time == this.endTime)
	{
		this.active = false;
		this.collider.getNode().material.color.setHex (0xaf00ff); // deactivated attacks (either due to collision or time) are purple
		
		if(this.attackType == "projectile")
		{
			this.owner.deleteHitBox(this);
		}
	}
	
	this.time += 1;
	
	if(this.owner.getActionFrames() == 0 && this.attackType != "projectile")
	{
		this.owner.deleteHitBox(this);
	}
};