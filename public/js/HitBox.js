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

    /** @property {String} highOrLow If the player needs to be standing or ducking to block this attack */
    this.highOrLow;

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
    this.highOrLow = null;

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
HitBox.prototype.initWithDimensionsAndPlayers = function(width, height, depth, owner, enemy)
{
    this.initEmpty();

    this.highOrLow = "any";

    this.owner = owner;
    this.enemy = enemy;

    this.collider = new Collider().initWithSettings(width, height, depth, this, false); // the last parameter indicates whether the collider is for a PlayerCharacter or not
    this.collider.setEnemy(enemy);

    this.active = false;

    return this;
};

/**
* Returns the Collider instance that belongs to this HitBox.
* 
* @return {Collider} This HitBox's Collider.
*/
HitBox.prototype.getCollider = function()
{
   return this.collider;
};

HitBox.prototype.getOwner = function()
{
   return this.owner;
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

        this.collider.setXVelocity(this.endingXVelocity);
        this.collider.setYVelocity(this.endingYVelocity);
        this.collider.setZVelocity(this.endingZVelocity);
        
        if(this.attackType == "projectile")
        {
            this.owner.deleteHitBox(this);
        }
    }
    
    this.time += 1;
    
    if(this.owner.getInactionableFrames() == 0 && this.attackType != "projectile")
    {
        this.owner.deleteHitBox(this);
        this.owner.getCollider().setXRotationSpeed(0);
        this.owner.getCollider().setYRotationSpeed(0);
        this.owner.getCollider().setZRotationSpeed(0);
        this.owner.getCollider().setRotation(0, 0, 0);
    }
};

/** 
* onCollision were use one collision is dectected. It determines if the attack is block or not , damage calculation and set repective velocity
*/

HitBox.prototype.onCollision = function()
{
    if( this.active == true && this.time >= this.beginTime)
    {
        this.active = false;
        this.collider.getNode().material.color.setHex (0xaf00ff); // deactivated attacks (either due to collision or time) are purple

        var worldPosition = new THREE.Vector3();
        worldPosition.setFromMatrixPosition( this.collider.getNode().matrixWorld ); // get world coordinates

        this.enemy.takeDamage(this.damage, worldPosition, this.attackType, this.highOrLow);

        if(this.attackType == "projectile")
        {
            this.time = this.endTime - 3; // show the projectile for 3 frames after collision
        }
    }
}; 