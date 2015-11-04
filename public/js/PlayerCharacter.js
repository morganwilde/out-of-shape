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
	
	// Timing
	this.actionFrames;

	// Health
	this.hp;
	this.maxHp;

	// Character attributes
	this.walkSpeed;
	this.dashSpeed;
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

	// Timing
	this.actionFrames = null;
	
	// Health
	this.hp = null;
	this.maxHp = null;

	// Character attributes
	this.walkSpeed = 0;
	this.dashSpeed  = 0;
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
	var material = new THREE.MeshPhongMaterial({
		color: 0x0000ff, 
		//side: THREE.DoubleSide, 
		wireframe: false,
		specular: 0x000000, 
		shininess: 0, 
		shading: THREE.FlatShading
	});

	this.node = new THREE.Mesh(geometry, material);
	
	this.actionFrames = 0;

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
	this.dashSpeed = 10;
	this.jumpSpeed = 30;
	this.gravity = 2;

	this.attacks['lightpunch'] = "star storm";
	this.attacks['heavypunch'] = "star shot";
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

PlayerCharacter.prototype.setXVelocity = function(velocity)
{
	this.xVelocity = velocity;
};

PlayerCharacter.prototype.setYVelocity = function(velocity)
{
	this.yVelocity = velocity;
};

PlayerCharacter.prototype.setActionFrames = function(frames)
{
	this.actionFrames = frames;
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
};

PlayerCharacter.prototype.getActionFrames = function()
{
	return this.actionFrames;
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

	if(this.characterState == "blocking" && this.actionFrames == 0)
	{
		this.node.material.color.setHex (0xaf00ff); // purple is blocking
	}

	if(this.checkCollision())
	{
		if((this.xVelocity>0 && this.node.position.x > this.enemy.getNode().position.x) || (this.xVelocity < 0 && this.node.position.x < this.enemy.getNode().position.x)) // removing  this.xVelocity < 0  allows passing through
		{
			this.node.position.x += this.xVelocity;
		}
		else
		{
			this.node.position.x -= this.xVelocity;
		}
		
		if(this.node.position.y > this.enemy.getNode().position.y && this.yVelocity < 0)
		{
			this.yVelocity = 0;//this.jumpSpeed;

			if(this.node.position.x>=this.enemy.node.position.x)
			this.xVelocity = this.dashSpeed;
			else
			this.xVelocity = -this.dashSpeed;
		}
	}
	
	this.node.position.x += this.xVelocity;

	this.node.position.y += this.yVelocity;

	this.yVelocity -= this.gravity;

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
		
		if(this.yVelocity < 0)
		{
			this.yVelocity = 0;
		}

		if(this.characterState  == "jumping")
		{
			this.characterState = "standing";
		}
		
		if(this.characterState == "blocking")
		{
			this.xVelocity = 0;
		}
	
	}

	if(this.actionFrames > 0)
	{
		this.actionFrames -= 1;
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
	
	if(this.press('block'))
	{
		if(this.characterState != "jumping")
		{
			this.xVelocity = 0;
		}
		
		this.actionFrames = 30;
		this.characterState  = "blocking";
		return;
	}
	
	if(this.keystates['block'] == false && this.characterState  == "blocking")
	{
		this.actionFrames = 30;
		this.node.material.color.setHex (0x0000ff); // blue is standing
		
		if(this.node.position.y <= gameEngine.arena.getRootObject().geometry.parameters.height/2+this.height/2)
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
	this.yVelocity = this.jumpSpeed;
};

PlayerCharacter.prototype.left = function()
{
	if(this.keystates['dash'])
	{
		this.xVelocity = -this.dashSpeed;
	}
	else
	{
		this.xVelocity = -this.walkSpeed;
	}
};

PlayerCharacter.prototype.right = function()
{
	if(this.keystates['dash'])
	{
		this.xVelocity = this.dashSpeed;
	}
	else
	{
		this.xVelocity = this.walkSpeed;
	}
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
	gameEngine.arena.getRootObject().remove(hitbox.getNode());
	
	var targetHitBox = this.hitBoxes.indexOf(hitbox);
	
	this.hitBoxes.splice(targetHitBox, 1); // 1 is the number of instances to remove
};

PlayerCharacter.prototype.takeDamage = function(damage, hitPosition)
{
	this.hp -= damage;

	if(this.node.position.x > hitPosition.x)
	{
		this.node.position.x += 15;
	}
	else
	{
		this.node.position.x -= 15;
	}
}

PlayerCharacter.prototype.checkCollision = function()
{
	return( this.checkVertexHit() || this.checkContain());
};

// *** modified from https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
PlayerCharacter.prototype.checkVertexHit = function()
{
	var originPoint = new THREE.Vector3();
	originPoint.setFromMatrixPosition( this.node.matrixWorld ); // get world coordinates
	
	for (var vertexIndex = 0; vertexIndex < this.node.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = this.node.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( this.node.matrix );
		var directionVector = globalVertex.sub( this.node.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObject( this.enemy.node , true);
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
		{
			return true;
		}
	}

	return false;
};
// ***

PlayerCharacter.prototype.checkContain = function() // checks if the center of the node is within the bounds of the enemy node, raycasts can't detect this kind of collision
{
	var worldPosition = new THREE.Vector3();
	worldPosition.setFromMatrixPosition( this.node.matrixWorld ); // get world coordinates

	return (Math.abs( worldPosition.x - this.enemy.getNode().position.x)<this.width && Math.abs( worldPosition.y - this.enemy.getNode().position.y)<this.height && Math.abs( worldPosition.z - this.enemy.getNode().position.z)<this.depth);
};