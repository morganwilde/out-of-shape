function PlayerCharacter()
{
	// Key codes
	this.keyvalues;

	// Key states
	this.keystates;

	// Key buffers
	this.keybuffers;
	this.buffertime;

	// Collision Box
	this.collider;
	
	// Opposing player character
	this.enemy;
	
	// Hit Boxes
	this.hitBoxes;
	
	// Attacks
	this.attacks;
	
	// Timing
	this.actionFrames;

	// Health
	this.healthBar;

	// Character attributes
	this.walkSpeed;
	this.dashSpeed;
	this.jumpSpeed;
	this.characterState;

	// Consecutive times this character has been hit while in hit-stun
	this.comboCount;
}

// Initialisers

PlayerCharacter.prototype.initEmpty = function()
{
	// Key codes
	this.keyvalues = {};

	// Key states
	this.keystates = {};

	// Key buffers
	this.keybuffers = {};
	this.buffertime = null;

	// Collision Box
	this.collider = null;

	// Opposing player character
	this.enemy;

	// Hit Boxes
	this.hitBoxes = new Array();

	// Attacks
	this.attacks = {};

	// Timing
	this.actionFrames = null;
	
	// Health
	this.healthBar = null;

	// Character attributes
	this.walkSpeed = null;
	this.dashSpeed  = null;
	this.jumpSpeed  = null;
	this.characterState  = null;

	// Consecutive times this character has been hit while in hit-stun
	this.comboCount = null;

  return this;
};

PlayerCharacter.prototype.initWithSettings = function(width, height, depth, character)
{
	this.initEmpty();

	this.collider = new Collider().initWithSettings(width, height, depth, this, true);  // the last parameter indicates whether the collider is for a PlayerCharacter or not

	if(character == "SuperStar")
	{
		this.superStar();
	}

	this.buffertime = 2;

	this.characterState  = "standing";
	
	this.actionFrames = 0;

	this.comboCount = 0;

	return this;
};

// Getters

PlayerCharacter.prototype.press = function(key)
{
	return this.keybuffers[key] == this.buffertime;
}

PlayerCharacter.prototype.getCharacterState = function()
{
	return this.characterState;
};

PlayerCharacter.prototype.getCollider = function()
{
	return this.collider;
};

PlayerCharacter.prototype.getActionFrames = function()
{
	return this.actionFrames;
};

// Setters

PlayerCharacter.prototype.setEnemy = function(enemy)
{
	this.enemy = enemy;
	this.collider.setEnemy(enemy);
}

PlayerCharacter.prototype.superStar = function()
{
	this.hp = 100;
	this.maxHp = 100;

	this.walkSpeed = 4;
	this.dashSpeed = 10;
	this.jumpSpeed = 30;
	this.collider.setGravity(2);
	var geometry = new THREE.BoxGeometry(50, 50, 50);
	var material = new THREE.MeshPhongMaterial({
		color: 0x0000ff, 
		//side: THREE.DoubleSide, 
		wireframe: false,
		specular: 0x000000, 
		shininess: 0, 
		shading: THREE.FlatShading
	});
	var head = new THREE.Mesh(geometry, material);
	head.position.y=75;
	head.position.x=10;
	this.collider.getNode().add(head);
	if(gameEngine.arena.player1!=null)
	this.collider.getNode().rotation.y = Math.PI;

	this.attacks['lightpunch'] = "star storm";
	this.attacks['heavypunch'] = "star shot";
	this.attacks['grab'] = "grab";
};

PlayerCharacter.prototype.setKeys = function(jump, crouch, left, right, lightpunch, heavypunch, lightkick, heavykick, dash, block, grab)
{
	this.keyvalues['jump'] = jump;
	this.keyvalues['crouch'] = crouch;
	this.keyvalues['left'] = left;
	this.keyvalues['right'] = right;
	this.keyvalues['lightpunch'] = lightpunch;
	this.keyvalues['heavypunch'] = heavypunch;
	this.keyvalues['lightkick'] = lightkick;
	this.keyvalues['heavykick'] = heavykick;
	this.keyvalues['dash'] = dash;
	this.keyvalues['block'] = block;
	this.keyvalues['grab'] = grab;
	
	this.keystates['jump'] = false;
	this.keystates['crouch'] = false;
	this.keystates['left'] = false;
	this.keystates['right'] = false;
	this.keystates['lightpunch'] = false;
	this.keystates['heavypunch'] = false;
	this.keystates['lightkick'] = false;
	this.keystates['heavykick'] = false;
	this.keystates['dash'] = false;
	this.keystates['block'] = false;
	this.keystates['grab'] = false;
	
	this.keybuffers['jump'] = 0;
	this.keybuffers['crouch'] = 0;
	this.keybuffers['left'] = 0;
	this.keybuffers['right'] = 0;
	this.keybuffers['lightpunch'] = 0;
	this.keybuffers['heavypunch'] = 0;
	this.keybuffers['lightkick'] = 0;
	this.keybuffers['heavykick'] = 0;
	this.keybuffers['dash'] = 0;
	this.keybuffers['block'] = 0;
	this.keybuffers['grab'] = 0;
};

PlayerCharacter.prototype.setKeyPress = function(keycode)
{
	for (var i in this.keyvalues)
	{
		if(keycode == this.keyvalues[i])
		{
			if(this.keybuffers[i] == 0 && this.keystates[i] == false) // on initial press
			{
				this.keybuffers[i] = this.buffertime;
			}
			
			this.keystates[i] = true;
		}
	}
};

PlayerCharacter.prototype.setKeyRelease = function(keycode)
{
	for (var i in this.keyvalues)
	{
		if(keycode == this.keyvalues[i])
		{
			this.keystates[i] = false;
		}
	}
};

PlayerCharacter.prototype.setHealthBar = function(healthBar)
{
	this.healthBar = healthBar;
};

PlayerCharacter.prototype.setCharacterState = function(state)
{
	this.characterState = state;
};

PlayerCharacter.prototype.setActionFrames = function(frames)
{
	this.actionFrames = frames;
};

// Methods

PlayerCharacter.prototype.createAttack = function(command)
{
	var hbox = new HitBox();

	hbox.initAttack(command, this, this.enemy);

	this.hitBoxes.push(hbox);
};

PlayerCharacter.prototype.update = function()
{
	if(this.actionFrames == 0)
	{
		this.resolveInput();
	}
	
	this.collider.update();

	if(this.characterState == "blocking")
	{
		this.collider.getNode().material.color.setHex (0xaf00ff); // purple is blocking
	}

	if(this.actionFrames > 0)
	{
		this.actionFrames -= 1;

		if(this.actionFrames == 0)
		{
			this.comboCount = 0;
			if(this.characterState == "standing" || this.characterState == "jumping")
			this.collider.getNode().material.color.setHex(0x0000ff);
		}
	}

	// update all hitboxes beloning to this character
	this.updateHitBoxes();
	
	// update keybuffer times
	this.updateKeyBuffers();
};

PlayerCharacter.prototype.resolveInput = function()
{
	
	if(this.press('lightpunch'))
	{
		this.createAttack(this.attacks['lightpunch']);
		return;
	}

	if(this.press('grab'))
	{
		this.createAttack(this.attacks['grab']);
		return;
	}

	if(this.keystates['block'] == true)
	{
		if(this.characterState == "standing" || this.characterState == "jumping")
		{
			if(this.characterState == "standing")
			{
				this.collider.setXVelocity(0);
			}
			
			this.actionFrames = 30;
			this.characterState = "initBlocking";

			return;
		}
		else
		{
			this.characterState  = "blocking";
			return;
		}
	}

	if(this.keystates['block'] == false && this.characterState  == "blocking") // end blocking
	{
		this.actionFrames = 30;

		this.collider.getNode().material.color.setHex (0x0000ff); // blue is standing
		
		if(this.collider.getNode().position.y <= gameEngine.arena.getRootObject().geometry.parameters.height/2+this.height/2)
		{
			this.characterState = "standing";
		}
		else
		{
			this.characterState = "jumping";
		}

		return;
	}
	
	if(this.press('heavypunch'))
	{
		this.createAttack(this.attacks['heavypunch']);
		return;
	}

	if(this.characterState  == "standing")
	{
		if(this.press('jump'))
		{
			this.jump();
			this.characterState  = "jumping";
		}

		if(this.keystates['left'])
		{
			this.left();
		}
		else if(this.keystates['right'])
		{
			this.right();
		}
		else
		{
			this.movementEnd();
		}
	}
};

PlayerCharacter.prototype.jump = function()
{
	this.collider.setYVelocity(this.jumpSpeed);
};

PlayerCharacter.prototype.left = function()
{
	this.collider.getNode().rotation.y = Math.PI;

	if(this.keystates['dash'])
	{
		this.collider.setXVelocity(-this.dashSpeed);
	}
	else
	{
		this.collider.setXVelocity(-this.walkSpeed);
	}
};

PlayerCharacter.prototype.right = function()
{
	this.collider.getNode().rotation.y = 0;

	if(this.keystates['dash'])
	{
		this.collider.setXVelocity(this.dashSpeed);
	}
	else
	{
		this.collider.setXVelocity(this.walkSpeed);
	}
};

PlayerCharacter.prototype.movementEnd = function()
{
	this.collider.setXVelocity(0);
};

PlayerCharacter.prototype.updateKeyBuffers = function()
{
	for (var i in this.keybuffers)
	{
		if(this.keybuffers[i] > 0)
		{
			this.keybuffers[i] -= 1;
		}
	}
};

PlayerCharacter.prototype.updateHitBoxes = function()
{
	for (var i in this.hitBoxes)
	{
		this.hitBoxes[i].update();
	}
};

PlayerCharacter.prototype.deleteHitBox = function(hitbox)
{
	this.collider.getNode().remove(hitbox.getCollider().getNode());
	gameEngine.arena.getRootObject().remove(hitbox.getCollider().getNode());
	
	var targetHitBox = this.hitBoxes.indexOf(hitbox);
	
	this.hitBoxes.splice(targetHitBox, 1); // 1 is the number of instances to remove
};

PlayerCharacter.prototype.takeDamage = function(damage, hitPosition, attackType)
{
	if(this.characterState == "blocking" && attackType != "grab")
	{
		damage = Math.round(damage / 10);
	}

	this.collider.getNode().material.color.setHex(0xffff00); // collider turns yellow during hit stun

	if(this.collider.getNode().position.y <= gameEngine.arena.getRootObject().geometry.parameters.height/2+this.height/2) // cancel initBlocking and blocking states
	{
		this.characterState = "standing";
	}
	else
	{
		this.characterState = "jumping";
	}

	this.actionFrames = (damage - this.comboCount) * 2;
	
	if(this.actionFrames < 1) // minimum hit stun
	{
		this.actionFrames = 1;
	}

	this.comboCount += 1;

	this.movementEnd();
	
	if(attackType == "grab")
	{
		this.collider.setYVelocity(40);
		this.characterState = "jumping";
	}

	this.healthBar.takeDamage(damage);

	this.collider.bump(hitPosition);
}