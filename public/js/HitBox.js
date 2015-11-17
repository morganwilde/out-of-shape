/**
* Create hitbox dimensions, handling the initial and ending velocity and time .
* Set collider box and enemy character. Determine the attack type  and damage of the 
* attack. status checking of the character class.
*
* @constructor
*/
function HitBox()
{	
	/** begin time */
	this.beginTime;
	/** duration */
	this.time;
	/** end time */
	this.endTime;

	/** Collision Box */
	this.collider;

	/** opposing character */
	this.enemy;

	/** owner of the hitbox */
	this.owner;
	/** attack type */
	this.attackType;

	/** intial X velocity */
	this.initialXVelocity;
	/** initial Y velocity */
	this.initialYVelocity;
	/** initial Z velocity */
	this.initialZVelocity;
	/** ending velocity if X */
	this.endingXVelocity;
	/** ending  velocity of Y */
	this.endingYVelocity;
	/** ending velocity of Z */
	this.endingZVelocity;
	/** damage instance */
	this.damage;
	/** status */
	this.active;
}


/**
* Constructor of the Hitbox class, set everything to null
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
/** constructor for the hitbox dimensions
* @param {int} width set the width of the hitbox
* @param {int} height set the height of the hitbox
* @param {int} depth set the depth of the hitbox
* @return {HitBox} initWithDimensions return the dimensions of the hitbox
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
*	initae the attack of a character and handling enemy state
* @param {string} command name of the attack type
* @param {PlayerCharacter} character character 
* @param {PlayerCharacter} class enemy character
*/

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

	if(command == "grab")
	{
		this.initGrab(character);
	}
	
	this.enemy = enemy;
	this.collider.setEnemy(enemy);
};

/**
* initiate Star Storm attack
* @param {PlayerCharacter} character character issueing the starstorm
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