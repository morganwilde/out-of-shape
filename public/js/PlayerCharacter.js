/**
 * PlayerCharacter is the base class for the player's in-game avatar. It is reponsible for maintaining attributes such as how fast the avatar walks, dashes or jumps. It also maitains the information about the current state the character is in, for example standing, walking or attacking. Currently it is also responsible for keeping track of the keyboard inputs and translating them into specific actions. This functionality will be moved over to a Keyboard class.
 * 
 * @constructor
 */
function PlayerCharacter()
{
    /** @property {Collider} collider Colliders are physics bodies that allow for collision detection. We use it to determine when PlayerCharacters hit each other or for any other object with an associated Collider. */
    this.collider;
    
    /** @property {PlayerCharacter} enemy A reference to the opponent's PlayerCharacter instance. This reference is required when creating HitBox objects targetting the opponent. */
    this.enemy;
    
    /** @property {Array} hitBoxes An array of all current offensive actions that are taking place, for example all attack HitBoxes. */
    this.hitBoxes;
    
    /** @property {object} attacks A key-value stored for identifying specific attacks that different PlayerCharacter classes have. For now, we only have one class, but in future releases PlayerCharacter subclasses will override the default values with their versions of the different attacks. */
    this.attacks;
    
    /** @property {Integer} inactionableFrames An integer that stores how many frames are remaining in the 'inactive' state, where the PlayerCharacter can't take any actions. */
    this.inactionableFrames;

    /** @property {HealthBar} healthBar A reference to the HealthBar object that indicates a PlayerCharacter's remaining health. */
    this.healthBar;

    // Character attributes
    /** @property {Integer} walkSpeed How much horizontal distance is covered in one frame while walking. Currently it's 4 units. */
    this.walkSpeed;
    /** @property {Integer} dashSpeed How much horizontal distance is covered in one frame while dashing. Currently it's 10 units. */
    this.dashSpeed;
    /** @property {Integer} jumpSpeed How much vertical distance is covered in one frame while jumping. Currently it's 30 units. */
    this.jumpSpeed;
    /** @property {String} characterState A string that indicates the current state of a PlayerCharacter, for exmple 'standing' or 'blocking'. */
    this.characterState;

    this.duckState;

    /** @property {Integer} comboCount The number of consecutive times this character has been hit while in the 'inactive' state. */
    this.comboCount;

    this.bodyColor;

    this.playerNumber;
    this.keyboard;
    this.arena;
}

// Initialisers
/**
 * Initializes a PlayerCharacter object with an empty state.
 * 
 * @return {PlayerCharacter} An empty version of a PlayerCharacter
 */
PlayerCharacter.prototype.initEmpty = function()
{
    this.keyValues = {};
    this.keyStates = {};
    this.keyBuffers = {};
    this.keyBufferTime = null;
    this.collider = null;
    this.enemy;
    this.hitBoxes = new Array();
    this.attacks = {};
    this.inactionableFrames = null;
    this.healthBar = null;
    this.walkSpeed = null;
    this.dashSpeed = null;
    this.jumpSpeed = null;
    this.characterState = null;
    this.duckState = null;
    this.comboCount = null;
    this.bodyColor = null;
    this.playerNumber = null;
    this.keyboard = null;
    this.arena = null;
    return this;
};
/**
 * Initializes a PlayerCharacter object with designated dimensions and a player character class.
 * 
 * @param  {Integer} width The horizontal size of the PlayerCharacter's Collider object.
 * @param  {Integer} height The vertical size of the PlayerCharacter's Collider object.
 * @param  {Integer} depth The depth size of the PlayerCharacter's Collider object.
 * @param  {Strings} Character currently there's only one Character class - 'SuperStar'.
 * @return {PlayerCharacter}
 */
PlayerCharacter.prototype.initWithDimensionsAndArena = function(width, height, depth, arena)
{
    // Something
    this.initEmpty();

    this.collider = new Collider().initWithSettings(width, height, depth, this, true, arena);  // the last parameter indicates whether the collider is for a PlayerCharacter or not

    this.arena = arena;
    if (this.arena.player1 != null) {
        this.playerNumber = 2;
        this.collider.getNode().rotation.y = Math.PI;
        this.bodyColor = 0x0f0f0f;
        
    }
    else
    {
        this.playerNumber = 1;
        this.bodyColor = 0x0000ff;
    }

    this.collider.getNode().material.color.setHex(this.bodyColor);

    this.keyBufferTime = 2;
    this.characterState = 'standing';
    this.duckState = false;
    this.inactionableFrames = 0;
    this.comboCount = 0;

    return this;
};

// Getters
/**
 * Answers whether a specific key is pressed.
 * 
 * @param  {Character} key A numeric code for the key pressed.
 * @return {Boolean} If the key is pressed.
 */
PlayerCharacter.prototype.press = function(key)
{
    return this.keyBuffers[key] == this.keyBufferTime;
};
/**
 * Gives the current state.
 * 
 * @return {String} Current state value.
 */
PlayerCharacter.prototype.getCharacterState = function()
{
    return this.characterState;
};
/**
 * Gives the current collider.
 * 
 * @return {Collider} Current Collider reference.
 */
PlayerCharacter.prototype.getCollider = function()
{
    return this.collider;
};
/**
 * Gives the remaining action frame count, I.e. the number of frames the PlayerCharacter is in the 'inactive' state.
 * 
 * @return {Integer} Action frame count.
 */
PlayerCharacter.prototype.getInactionableFrames = function()
{
    return this.inactionableFrames;
};

// Setters
/**
 * Saves a reference to the opponent's PlayerCharacter instance.
 * 
 * @param {PlayerCharacter} enemy An istance of the opponent's PlayerCharacter.
 */
PlayerCharacter.prototype.setEnemy = function(enemy)
{
    this.enemy = enemy;
    this.collider.setEnemy(enemy);
};

/**
 * Associates a HealthBar object with this PlayerCharacter.
 * 
 * @param {HealthBar} healthBar Reference to a HealthBar object.
 */
PlayerCharacter.prototype.setHealthBar = function(healthBar)
{
    this.healthBar = healthBar;
};
/**
 * Changes the current PlayerCharacter state.
 * 
 * @param {String} state Name of the PlayerCharacter state.
 */
PlayerCharacter.prototype.setCharacterState = function(state)
{
    this.characterState = state;
};
/**
 * Sets how many frames an action requires.
 * 
 * @param {Integer} frames Number of frames.
 */
PlayerCharacter.prototype.setInactionableFrames = function(frames)
{
    this.inactionableFrames = frames;
};

// Methods
/**
 * Creates a HitBox of a certain type and adds it to the hitBoxes array.
 * 
 * @param {String} command Name of the command which is used a basis for the HitBox initializer.
 */
PlayerCharacter.prototype.createAttack = function(command)
{
    var hbox = new command().init(this, this.enemy);

   this.hitBoxes.push(hbox);
};
/**
 * This method is called within the Engine update method. It's responsible for responding to user input, updating the Collider of the PlayerCharacter and the active HitBoxes.
 */
PlayerCharacter.prototype.update = function()
{
    if (this.inactionableFrames == 0) {
        this.resolveInput();
    }
    
    this.collider.update();

    if (this.characterState == 'blocking') {
        this.collider.getNode().material.color.setHex(0xaf00ff); // purple is blocking
    }

    if (this.inactionableFrames > 0) {
        this.inactionableFrames -= 1;
        if (this.inactionableFrames == 0) {
            this.comboCount = 0;
            if (this.characterState == 'standing' || this.characterState == 'jumping') {
                this.collider.getNode().material.color.setHex(this.bodyColor);
            }
        }
    }

    // update all hitboxes beloning to this character
    this.updateHitBoxes();

    return this.healthBar.getHealth();
};
/**
 * Analyses the current PlayerCharacter state and any active keyboard commands to determine what kind of PlayerCharacter state changes need to happen. For example, if the user presses a key associated with the heavypunch attack, this method creates an appropriate HitBox and adds it to the stack.
 */
PlayerCharacter.prototype.resolveInput = function()
{
    if(this.keyboard.getKeyState('block'+this.playerNumber) == false)
    {
        if (this.keyboard.press('lightpunch'+this.playerNumber)) {
            if(this.duckState == true)
            {
               this.createAttack(this.attacks['lowlightpunch']);
            }
            else
            {
                this.createAttack(this.attacks['lightpunch']);
            };
            return;
        }

         if (this.keyboard.press('heavypunch'+this.playerNumber)){
            if(this.duckState == true)
            {
               this.createAttack(this.attacks['lowheavypunch']);
            }
            else
            {
                this.createAttack(this.attacks['heavypunch']);
            }
            return;
        }

        if (this.keyboard.press('lightkick'+this.playerNumber)) {
            if(this.duckState == true)
            {
               this.createAttack(this.attacks['lowlightkick']);
            }
            else
            {
                this.createAttack(this.attacks['lightkick']);
            }
            return;
        }

         if (this.keyboard.press('heavykick'+this.playerNumber)){
            if(this.duckState == true)
            {
               this.createAttack(this.attacks['lowheavykick']);
            }
            else
            {
                this.createAttack(this.attacks['heavykick']);
            }
            return;
        }

        if (this.keyboard.press('grab'+this.playerNumber)) {
            this.createAttack(this.attacks['grab']);
            return;
        }
    }

    if (this.characterState != 'jumping') // ducking
    {
        if (this.keyboard.getKeyState('duck'+this.playerNumber) == true){
            this.duck();
            this.duckState = true;
            this.movementEnd();
        }

        if (this.keyboard.getKeyState('duck'+this.playerNumber) == false && this.duckState == true){
            this.standUp();
            this.duckState = false;
        }
    }

    if (this.keyboard.getKeyState('block'+this.playerNumber) == true) {
        if (this.characterState == 'standing' || this.characterState == 'jumping') {
            if (this.characterState == 'standing') {
                this.collider.setXVelocity(0);
            }
            this.inactionableFrames = 10;
            this.characterState = 'initBlocking';
        } else {
            this.characterState  = 'blocking';
        }
        return;
    }

    if (this.keyboard.getKeyState('block'+this.playerNumber) == false && this.characterState  == 'blocking') {
        // end blocking
        this.inactionableFrames = 30;

        this.collider.getNode().material.color.setHex (this.bodyColor); // blue is standing
        
        var initialVerticalPosition = this.arena.getRootObject().geometry.parameters.height/2 + this.height/2;
        if (this.collider.getNode().position.y <= initialVerticalPosition) {
            this.characterState = 'standing';
        } else {
            this.characterState = 'jumping';
        }
        return;
    }

    if (this.characterState  == 'standing') {

        if(this.duckState == false){

            if (this.keyboard.press('jump'+this.playerNumber)) {
                this.jump();
                this.characterState  = 'jumping';
            }

            if (this.keyboard.getKeyState('left'+this.playerNumber) == true) {
                this.left();
            } else if (this.keyboard.getKeyState('right'+this.playerNumber) == true) {
                this.right();
            } else {
                this.movementEnd();
            }
        }
    }
};

PlayerCharacter.prototype.duck = function()
{
    this.collider.getNode().scale.y = .5;
    this.collider.setRelativePosition(0, - this.collider.getHeight()/2, 0);
};
PlayerCharacter.prototype.standUp = function()
{
    this.collider.getNode().scale.y = 1;
};
/**
 * Changes the PlayerCharacter's Y velocity to display a jump action.
 */
PlayerCharacter.prototype.jump = function()
{
    this.collider.setYVelocity(this.jumpSpeed);
};
/**
 * Rotates the PlayerCharacter and changes it's X velocity to display left movement.
 */
PlayerCharacter.prototype.left = function()
{
    this.collider.getNode().rotation.y = Math.PI;
    this.collider.setXVelocity(this.keyboard.getKeyState('dash'+this.playerNumber) ? -this.dashSpeed : -this.walkSpeed);
};
/**
 * Rotates the PlayerCharacter and changes it's X velocity to display right movement.
 */
PlayerCharacter.prototype.right = function()
{
    this.collider.getNode().rotation.y = 0;
    this.collider.setXVelocity(this.keyboard.getKeyState('dash'+this.playerNumber) ? this.dashSpeed : this.walkSpeed);
};
/**
 * Resets X velocity to stop all lateral movement.
 */
PlayerCharacter.prototype.movementEnd = function()
{
    this.collider.setXVelocity(0);
};

/**
 * Iterates over all active HitBoxes and calls their update() method.
 */
PlayerCharacter.prototype.updateHitBoxes = function()
{
    for (var i in this.hitBoxes) {
        this.hitBoxes[i].update();
    }
};
/**
 * Removes a specific HitBox from the scene and from the hitBoxes array.
 * 
 * @param  {HitBox} hitbox A reference to the HitBox you want removed.
 */
PlayerCharacter.prototype.deleteHitBox = function(hitbox)
{
    this.collider.getNode().remove(hitbox.getCollider().getNode());
    this.arena.getRootObject().remove(hitbox.getCollider().getNode());
    
    var targetHitBox = this.hitBoxes.indexOf(hitbox);
    
    this.hitBoxes.splice(targetHitBox, 1); // 1 is the number of instances to remove
};
/**
 * Analyses the current PlayerCharacter state and takes some damage. Also, it updates the associated HealthBar and Collider.
 * @param  {Integer} damage A number that indicates the initial damage.
 * @param  {Position} hitPosition The vector of the HitBox that triggered the collision.
 * @param  {String} attackType The form of attack (melee, projectile, or grab).
 */
PlayerCharacter.prototype.takeDamage = function(damage, hitPosition, attackType, highOrLow)
{
    if (this.characterState == 'blocking' && attackType != 'grab' && ( (highOrLow == "any") || (highOrLow == "low" && this.duckState == true) || (highOrLow == "high" && this.duckState == false) ) ) {
        damage = Math.round(damage / 10);
    }

    this.collider.getNode().material.color.setHex(0xffff00); // collider turns yellow during hit stun
    this.collider.setRotation(0, this.collider.getNode().rotation.y, 0);

    for(var i = 0; i < this.hitBoxes.length; i++)
    {
        if(this.hitBoxes[i].getAttackType()!="projectile")
        {
            this.deleteHitBox(this.hitBoxes[i]);
            i-=1;
        }
    }

    var initialVerticalPosition = this.arena.getRootObject().geometry.parameters.height/2 + this.height/2;
    if (this.collider.getNode().position.y <= initialVerticalPosition) {
        // cancel initBlocking and blocking states
        this.characterState = 'standing';
    } else {
        this.characterState = 'jumping';
    }

    this.inactionableFrames = (damage - this.comboCount) * 2;
    
    if (this.inactionableFrames < 1) {
        // minimum hit stun
        this.inactionableFrames = 1;
    }

    this.comboCount += 1;
    this.movementEnd();
    
    if (attackType == 'grab') {
        this.collider.setYVelocity(40);
        this.characterState = 'jumping';
    }

    this.healthBar.takeDamage(damage);
    this.collider.bump(hitPosition);
};