function PlayerCharacter()
{
	// Size
	this.width;
	this.height;
	this.depth;

	// Key codes
	this.keyvalues;

	// Key states
	this.keystates;

	// Key buffers
	this.keybuffers;
	this.buffertime;

	// Root of type Object3D - http://threejs.org/docs/index.html#Reference/Core/Object3D
	this.node;
	
	// Opposing player character
	this.enemy;
	
	// Hit Boxes
	this.hitBoxes;
	
	// Attacks
	this.attacks;

	// Health
	this.hp;
	this.maxHp;

	// Character attributes
	this.walkSpeed;
	this.runSpeed;
	this.jumpSpeed;
	this.xVelocity;
	this.yVelocity;
	this.gravity;
	this.characterState;
}

// Initialisers

PlayerCharacter.prototype.initEmpty = function()
{
	// Size
	this.width = null;
	this.height = null;
	this.depth = null;

	// Key codes
	this.keyvalues = {};

	// Key states
	this.keystates = {};

	// Key buffers
	this.keybuffers = {};
	this.buffertime = null;

	// Root
	this.node = null;

	// Opposing player character
	this.enemy;

	// Hit Boxes
	this.hitBoxes = new Array();

	// Attacks
	this.attacks = {};
	
	// Health
	this.hp = null;
	this.maxHp = null;

	// Character attributes
	this.walkSpeed = 0;
	this.runSpeed  = 0;
	this.jumpSpeed  = 0;
	this.xVelocity  = 0;
	this.yVelocity  = 0;
	this.gravity  = 0;
	this.characterState  = "";

  return this;
};

PlayerCharacter.prototype.initWithDimensions = function(width, height, depth, character)
{
	this.initEmpty();

	this.width = width;
	this.height = height;
	this.depth = depth;

	this.buffertime = 2;

	this.characterState  = "standing";

	// Starting shape
	var geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
	var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
	this.node = new THREE.Mesh(geometry, material);

	if(character == "SuperStar")
	{
		this.superStar();
	}

	return this;
};

// Setters

PlayerCharacter.prototype.setEnemy = function(enemy)
{
	this.enemy = enemy;
}

PlayerCharacter.prototype.setName = function(name)
{
	this.node.name = name;
}

PlayerCharacter.prototype.superStar = function()
{
	this.hp = 100;
	this.maxHp = 100;

	this.walkSpeed = 4;
	this.runSpeed = 10;
	this.jumpSpeed = 30;
	this.gravity = 2;
	
	this.attacks['lightpunch'] = "star storm";
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

// Getters

PlayerCharacter.prototype.getNode = function()
{
   return this.node;
};

PlayerCharacter.prototype.press = function(key)
{
	return this.keybuffers[key] == this.buffertime;
}

PlayerCharacter.prototype.getWidth = function()
{
	return this.width;
}

PlayerCharacter.prototype.getHeight = function()
{
	return this.height;
}

// Methods

PlayerCharacter.prototype.createAttack = function(command)
{
	var hbox = new HitBox();

	hbox.initAttack(command, this, this.enemy);

	this.hitBoxes.push(hbox);
}

PlayerCharacter.prototype.update = function()
{
	if(this.press('lightpunch'))
	{
		this.createAttack(this.attacks['lightpunch']);
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
	
	var raycaster = new THREE.Raycaster();
	var intersects;
	
	raycaster.set(this.node.position, new THREE.Vector3(0,-1,0));
	
	//if()
	this.node.position.x += this.xVelocity;
	
	this.node.position.y += this.yVelocity;

	//intersects = raycaster.intersectObjects( gameEngine.scene.children, false);
	
	//if( intersects.length>0 && intersects[0].distance<this.height)
		
	{
		this.yVelocity -= this.gravity;
	}
	
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
	
	// floor bounds player's falling
	if(this.node.position.y <= gameEngine.arena.getRootObject().geometry.parameters.height/2+this.height/2)
	{
		this.node.position.y = gameEngine.arena.getRootObject().geometry.parameters.height/2+this.height/2;
		
		if(this.characterState  == "jumping")
		{
			this.characterState = "standing";
		}
	
	}
	
	// update all hitboxes beloning to this character
	this.updateHitBoxes();
	
	// update keybuffer times
	this.updateKeyBuffers();
};

PlayerCharacter.prototype.jump = function()
{
	this.yVelocity = this.jumpSpeed;
};

PlayerCharacter.prototype.left = function()
{
	this.xVelocity = -this.walkSpeed;
};

PlayerCharacter.prototype.right = function()
{
	this.xVelocity = this.walkSpeed;
};

PlayerCharacter.prototype.movementEnd = function()
{
	this.xVelocity = 0;
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
	this.node.remove(hitbox.getNode());
	
	var targetHitBox = this.hitBoxes.indexOf(hitbox);
	
	this.hitBoxes.splice(targetHitBox, 1); // 1 is the number of instances to remove
}