/**
 * PlayerCharacter is the base class for the player's in-game avatar. It is reponsible for maintaining attributes such as how fast the avatar walks, dashes or jumps. It also maitains the information about the current state the character is in, for example standing, walking or attacking. Currently it is also responsible for keeping track of the keyboard inputs and translating them into specific actions. This functionality will be moved over to a Keyboard class.
 * 
 * @constructor
 */
function PlayerCharacter()
{
    /** @property {object} keyValues A key-value store for player character actions and their associated keyboard keys. */
    this.keyValues;

    /** @property {object} keyStates A key-value store for character actions and a boolean indicating if they're currently active. Keeping track of key state (up or down) is important when considering long key presses, those that exhaust the key buffer. */
    this.keyStates;

    /** @property {object} keyBuffers A place to store how many frames a certain action has remaining. If an action has zero in the key buffer, it is considered finished. */
    this.keyBuffers;
    /** @property {Integer} keyBufferTime A default keyBuffers frame count. Currently stored as 2. */
    this.keyBufferTime;

    /** @property {Collider} collider Colliders are physics bodies that allow for collision detection. We use it to determine when PlayerCharacters hit each other or any other object with an associated Collider. */
    this.collider;
    
    /** @property {PlayerCharacter} enemy A reference to the opponent's PlayerCharacter instance. This reference is required when creating HitBox objects targetting the opponent. */
    this.enemy;
    
    /** @property {Array} hitBoxes An array of all current actions that are taking place, for example all attack HitBoxes. */
    this.hitBoxes;
    
    /** @property {object} attacks A key-value store for identifying specific attacks that different PlayerCharacter classes have. For now, we only have one class, but in future releases PlayerCharacter subclasses will override the default values with their versions of the different attacks. */
    this.attacks;
    
    /** @property {Integer} actionFrames An integer that stores how many frame are remaining in the 'inactive' state, where the PlayerCharacter can't take any actions. */
    this.actionFrames;

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

    /** @property {Integer} comboCount The number of consecutive times this character has been hit while in the 'inactive' state. */
    this.comboCount;
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
    this.actionFrames = null;
    this.healthBar = null;
    this.walkSpeed = null;
    this.dashSpeed = null;
    this.jumpSpeed = null;
    this.characterState = null;
    this.comboCount = null;
	return this;
};
/**
 * Initializes a PlayerCharacter object with designated dimensions and a player character class.
 * 
 * @param  {Integer} width The horizontal size of the PlayerCharacter's Collider object.
 * @param  {Integer} height The vertical size of the PlayerCharacter's Collider object.
 * @param  {Integer} depth The depth of the PlayerCharacter's Collider object.
 * @param  {Strings} Character currently there's only one Character class - 'SuperStar'.
 * @return {PlayerCharacter}
 */
PlayerCharacter.prototype.initWithSettings = function(width, height, depth, character)
{
    this.initEmpty();

    this.collider = new Collider().initWithSettings(width, height, depth, this, true);  // the last parameter indicates whether the collider is for a PlayerCharacter or not

    if (character == 'SuperStar') {
        this.superStar();
    }

    this.keyBufferTime = 2;
    this.characterState = 'standing';
    this.actionFrames = 0;
    this.comboCount = 0;

    return this;
};
/**
 * Initializes PlayerCharacter attributes specific to this player character class.
 */
PlayerCharacter.prototype.superStar = function()
{
    this.walkSpeed = 4;
    this.dashSpeed = 10;
    this.jumpSpeed = 30;
    this.collider.setGravity(2);
    var geometry = new THREE.BoxGeometry(50, 50, 50);
    var material = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        wireframe: false,
        specular: 0x000000, 
        shininess: 0, 
        shading: THREE.FlatShading
    });
    var head = new THREE.Mesh(geometry, material);
    head.position.y = 75;
    head.position.x = 10;
    this.collider.getNode().add(head);
    if (gameEngine.arena.player1 != null) {
    	this.collider.getNode().rotation.y = Math.PI;
    }

    this.attacks['lightpunch'] = 'star storm';
    this.attacks['heavypunch'] = 'star shot';
    this.attacks['grab'] = 'grab';
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
 * Gives the remaining action frame count, I.e. the number of frame the PlayerCharacter is in the 'inactive' state.
 * 
 * @return {Integer} Action frame count.
 */
PlayerCharacter.prototype.getActionFrames = function()
{
    return this.actionFrames;
};

// Setters
/**
 * Saves a reference to the opponent's PlayerCharacter.
 * 
 * @param {PlayerCharacter} enemy An istance of the opponent's PlayerCharacter.
 */
PlayerCharacter.prototype.setEnemy = function(enemy)
{
    this.enemy = enemy;
    this.collider.setEnemy(enemy);
};
/**
 * Associates keyboard keys with specific PlayerCharacter actions.
 * 
 * @param {Character} jump Numerical key code for the Jump command.
 * @param {Character} crouch Numerical key code for the Crouch command.
 * @param {Character} left Numerical key code for the Left command.
 * @param {Character} right Numerical key code for the Right command.
 * @param {Character} lightpunch Numerical key code for the Lightpunch command.
 * @param {Character} heavypunch Numerical key code for the Heavypunch command.
 * @param {Character} lightkick Numerical key code for the Lightkick command.
 * @param {Character} heavykick Numerical key code for the Heavykick command.
 * @param {Character} dash Numerical key code for the Dash command.
 * @param {Character} block Numerical key code for the Block command.
 * @param {Character} grab Numerical key code for the Grab command.
 */
PlayerCharacter.prototype.setKeys = function(jump, crouch, left, right, lightpunch, heavypunch, lightkick, heavykick, dash, block, grab)
{
    this.keyValues['jump'] = jump;
    this.keyValues['crouch'] = crouch;
    this.keyValues['left'] = left;
    this.keyValues['right'] = right;
    this.keyValues['lightpunch'] = lightpunch;
    this.keyValues['heavypunch'] = heavypunch;
    this.keyValues['lightkick'] = lightkick;
    this.keyValues['heavykick'] = heavykick;
    this.keyValues['dash'] = dash;
    this.keyValues['block'] = block;
    this.keyValues['grab'] = grab;
    
    this.keyStates['jump'] = false;
    this.keyStates['crouch'] = false;
    this.keyStates['left'] = false;
    this.keyStates['right'] = false;
    this.keyStates['lightpunch'] = false;
    this.keyStates['heavypunch'] = false;
    this.keyStates['lightkick'] = false;
    this.keyStates['heavykick'] = false;
    this.keyStates['dash'] = false;
    this.keyStates['block'] = false;
    this.keyStates['grab'] = false;
    
    this.keyBuffers['jump'] = 0;
    this.keyBuffers['crouch'] = 0;
    this.keyBuffers['left'] = 0;
    this.keyBuffers['right'] = 0;
    this.keyBuffers['lightpunch'] = 0;
    this.keyBuffers['heavypunch'] = 0;
    this.keyBuffers['lightkick'] = 0;
    this.keyBuffers['heavykick'] = 0;
    this.keyBuffers['dash'] = 0;
    this.keyBuffers['block'] = 0;
    this.keyBuffers['grab'] = 0;
};
/**
 * Changes the state of a specific key to an active state.
 * 
 * @param {Character} keycode Numerical key code.
 */
PlayerCharacter.prototype.setKeyPress = function(keycode)
{
    for (var i in this.keyValues) {
        if (keycode == this.keyValues[i]) {
            if (this.keyBuffers[i] == 0 && this.keyStates[i] == false) {
            	// on initial press
                this.keyBuffers[i] = this.keyBufferTime;
            }
            this.keyStates[i] = true;
        }
    }
};
/**
 * Changes the state of a specific key to an inactive state.
 * 
 * @param {Character} keycode Numerical key code.
 */
PlayerCharacter.prototype.setKeyRelease = function(keycode)
{
    for (var i in this.keyValues) {
        if (keycode == this.keyValues[i]) {
            this.keyStates[i] = false;
        }
    }
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
 * @param {Integer} frames Number of frame.
 */
PlayerCharacter.prototype.setActionFrames = function(frames)
{
    this.actionFrames = frames;
};

// Methods
/**
 * Creates a HitBox of a certain type and adds it to the hitBoxes array.
 * 
 * @param {String} command Name of the command which is used a basis for the HitBox initializer.
 */
PlayerCharacter.prototype.createAttack = function(command)
{
    var hbox = new HitBox();

    hbox.initAttack(command, this, this.enemy);

    this.hitBoxes.push(hbox);
};
/**
 * This method is called within the Engine update method. It's responsible for responding to user input, updating the collision body of the PlayerCharacter and the active HitBoxes.
 */
PlayerCharacter.prototype.update = function()
{
    if (this.actionFrames == 0) {
        this.resolveInput();
    }
    
    this.collider.update();

    if (this.characterState == 'blocking') {
        this.collider.getNode().material.color.setHex(0xaf00ff); // purple is blocking
    }

    if (this.actionFrames > 0) {
        this.actionFrames -= 1;
        if (this.actionFrames == 0) {
            this.comboCount = 0;
            if (this.characterState == 'standing' || this.characterState == 'jumping') {
            	this.collider.getNode().material.color.setHex(0x0000ff);
            }
        }
    }

    // update all hitboxes beloning to this character
    this.updateHitBoxes();
    
    // update keybuffer times
    this.updateKeyBuffers();
};
/**
 * Analyses the current PlayerCharacter state and any active keyboard commands to determine what kind of PlayerCharacter state changes need to happen. For example, if the user presses a key associated with the heavypunch attack, this method creates an appropriate HitBox and adds it to the stack.
 */
PlayerCharacter.prototype.resolveInput = function()
{
    if (this.press('lightpunch')) {
        this.createAttack(this.attacks['lightpunch']);
        return;
    }

    if (this.press('grab')) {
        this.createAttack(this.attacks['grab']);
        return;
    }

    if (this.keyStates['block'] == true) {
        if (this.characterState == 'standing' || this.characterState == 'jumping') {
            if (this.characterState == 'standing') {
                this.collider.setXVelocity(0);
            }
            this.actionFrames = 30;
            this.characterState = 'initBlocking';
        } else {
            this.characterState  = 'blocking';
        }
        return;
    }

    if (this.keyStates['block'] == false && this.characterState  == 'blocking') {
    	// end blocking
        this.actionFrames = 30;

        this.collider.getNode().material.color.setHex (0x0000ff); // blue is standing
        
        var initialVerticalPosition = gameEngine.arena.getRootObject().geometry.parameters.height/2 + this.height/2;
        if (this.collider.getNode().position.y <= initialVerticalPosition) {
            this.characterState = 'standing';
        } else {
            this.characterState = 'jumping';
        }
        return;
    }
    
    if (this.press('heavypunch')){
        this.createAttack(this.attacks['heavypunch']);
        return;
    }

    if (this.characterState  == 'standing') {
        if (this.press('jump')) {
            this.jump();
            this.characterState  = 'jumping';
        }

        if (this.keyStates['left']) {
            this.left();
        } else if (this.keyStates['right']) {
            this.right();
        } else {
            this.movementEnd();
        }
    }
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
    this.collider.setXVelocity(this.keyStates['dash'] ? -this.dashSpeed : -this.walkSpeed);
};
/**
 * Rotates the PlayerCharacter and changes it's X velocity to display right movement.
 */
PlayerCharacter.prototype.right = function()
{
    this.collider.getNode().rotation.y = 0;
    this.collider.setXVelocity(this.keyStates['dash'] ? this.dashSpeed : this.walkSpeed);
};
/**
 * Resets X velocity to stop all lateral movement.
 */
PlayerCharacter.prototype.movementEnd = function()
{
    this.collider.setXVelocity(0);
};
/**
 * Iterates over all key buffers and reduces their count if there's any commands left in the buffer.
 */
PlayerCharacter.prototype.updateKeyBuffers = function()
{
    for (var i in this.keyBuffers) {
        if (this.keyBuffers[i] > 0) {
            this.keyBuffers[i] -= 1;
        }
    }
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
    gameEngine.arena.getRootObject().remove(hitbox.getCollider().getNode());
    
    var targetHitBox = this.hitBoxes.indexOf(hitbox);
    
    this.hitBoxes.splice(targetHitBox, 1); // 1 is the number of instances to remove
};
/**
 * Analyses the current PlayerCharacter state and takes some damage. Also, it updates the associated HealthBar and Collider.
 * @param  {Integer} damage A number that indicates the initial damage.
 * @param  {Position} hitPosition The vector of the HitBox that triggered the collision.
 * @param  {String} attackType The name of the attack.
 */
PlayerCharacter.prototype.takeDamage = function(damage, hitPosition, attackType)
{
    if (this.characterState == 'blocking' && attackType != 'grab') {
        damage = Math.round(damage / 10);
    }

    this.collider.getNode().material.color.setHex(0xffff00); // collider turns yellow during hit stun

    var initialVerticalPosition = gameEngine.arena.getRootObject().geometry.parameters.height/2 + this.height/2;
    if (this.collider.getNode().position.y <= initialVerticalPosition) {
    	// cancel initBlocking and blocking states
        this.characterState = 'standing';
    } else {
        this.characterState = 'jumping';
    }

    this.actionFrames = (damage - this.comboCount) * 2;
    
    if (this.actionFrames < 1) {
    	// minimum hit stun
        this.actionFrames = 1;
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