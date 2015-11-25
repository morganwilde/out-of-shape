function StarStorm()
{
	HitBox.call(this);
}
StarStorm.prototype = Object.create(HitBox.prototype);
StarStorm.prototype.constructor = StarStorm;

StarStorm.prototype.init = function(owner, enemy)
{
	this.initWithDimensionsAndPlayers(50, 50, 50, owner, enemy);

	owner.setInactionableFrames(30);

	owner.getCollider().setXVelocity(0);

	owner.getCollider().getNode().add(this.collider.getNode());

	this.attackType = "melee";
	
	var xstart = this.collider.getWidth()/2 + owner.getCollider().getWidth()/2;
	var ystart = 50;
	
	this.collider.setPosition(xstart, ystart, 0);

	this.beginTime = 5;

	this.endTime = 15;
	
	this.damage = 20;

	return this;
};

function StarBlast()
{
	HitBox.call(this);
}
StarBlast.prototype = Object.create(HitBox.prototype);
StarBlast.prototype.constructor = StarBlast;

StarBlast.prototype.init = function(owner, enemy)
{
	this.initWithDimensionsAndPlayers(75, 50, 50, owner, enemy);

	owner.setInactionableFrames(35);

	owner.getCollider().setXVelocity(0);

	var ownerRotation = (owner.getCollider().getNode().rotation.y == 0) ? 1 : -1;

	var xstart = owner.getCollider().getNode().position.x + ownerRotation * (this.collider.getWidth()/2 + owner.getCollider().getWidth()/2);

	var ystart = owner.getCollider().getNode().position.y;
	
	this.collider.setPosition(xstart, ystart, 0);

	gameEngine.arena.getRootObject().add(this.collider.getNode());

	this.attackType = "projectile";

	this.initialXVelocity = ownerRotation*10;

	this.beginTime = 15;

	this.endTime = 95;
	
	this.damage = 2;

	return this;
};

function Grab()
{
	HitBox.call(this);
}
Grab.prototype = Object.create(HitBox.prototype);
Grab.prototype.constructor = Grab;

Grab.prototype.init = function(owner, enemy)
{
	this.initWithDimensionsAndPlayers(50, 50, 50, owner, enemy);

	owner.setInactionableFrames(95);

	owner.getCollider().setXVelocity(0);

	owner.getCollider().getNode().add(this.collider.getNode());

	this.attackType = "Grab";
	
	var xstart = this.collider.getWidth()/2 + owner.getCollider().getWidth()/2;
	var ystart = 0;
	
	this.collider.setPosition(xstart, ystart, 0);

	this.beginTime = 15;

	this.endTime = 65;
	
	this.damage = 20;

	return this;
};

function ShootingStar()
{
	HitBox.call(this);
}
ShootingStar.prototype = Object.create(HitBox.prototype);
ShootingStar.prototype.constructor = ShootingStar;

ShootingStar.prototype.init = function(owner, enemy)
{
	this.initWithDimensionsAndPlayers(70, 50, 50, owner, enemy);

	owner.setInactionableFrames(35);

	owner.getCollider().setXVelocity(0);

	owner.getCollider().getNode().add(this.collider.getNode());

	this.attackType = "projectile";
	
	var xstart = this.collider.getWidth()/2 + owner.getCollider().getWidth()/2;
	var ystart = 0;
	
	this.collider.setPosition(xstart, ystart, 0);

	this.initialXVelocity = 10;

	this.beginTime = 15;

	this.endTime = 95;
	
	this.damage = 2;

	return this;
};

function Jab()
{
	HitBox.call(this);
}
Jab.prototype = Object.create(HitBox.prototype);
Jab.prototype.constructor = Jab;

Jab.prototype.init = function(owner, enemy)
{
	this.initWithDimensionsAndPlayers(50, 50, 50, owner, enemy);

	owner.setInactionableFrames(30);

	owner.getCollider().setXVelocity(0);

	owner.getCollider().getNode().add(this.collider.getNode());

	this.attackType = "melee";
	
	var xstart = 0;
	var ystart = 0;
	
	this.collider.setPosition(xstart, ystart, 0);

	this.initialXVelocity = 10;
	this.endingXVelocity = -6;

	this.beginTime = 3;

	this.endTime = 12;
	
	this.damage = 2;

	return this;
};

function UpperCut()
{
	HitBox.call(this);
}
UpperCut.prototype = Object.create(HitBox.prototype);
UpperCut.prototype.constructor = UpperCut;

UpperCut.prototype.init = function(owner, enemy)
{
	this.initWithDimensionsAndPlayers(50, 50, 50, owner, enemy);

	owner.setInactionableFrames(40);

	owner.getCollider().setXVelocity(0);

	owner.getCollider().getNode().add(this.collider.getNode());

	this.attackType = "melee";
	
	var xstart = this.collider.getWidth()/2 + owner.getCollider().getWidth()/2;
	var ystart = -this.collider.getHeight()/2;
	
	this.collider.setPosition(xstart, ystart, 0);

	this.initialXVelocity = 7;
	this.initialYVelocity = 14;

	this.beginTime = 3;

	this.endTime = 12;
	
	this.damage = 2;

	return this;
};

function SweepKick()
{
	HitBox.call(this);
}
SweepKick.prototype = Object.create(HitBox.prototype);
SweepKick.prototype.constructor = SweepKick;

SweepKick.prototype.init = function(owner, enemy)
{
	this.initWithDimensionsAndPlayers(100, 50, 50, owner, enemy);

	owner.setInactionableFrames(40);

	owner.getCollider().setXVelocity(0);

	owner.getCollider().getNode().add(this.collider.getNode());

	this.attackType = "melee";
	
	var xstart = this.collider.getWidth()/2 + owner.getCollider().getWidth()/2;
	var ystart = -this.collider.getHeight()/2;
	
	this.collider.setPosition(xstart, ystart, 0);

	this.initialXVelocity = 0;
	this.initialYVelocity = 0;

	this.beginTime = 3;

	this.endTime = 12;
	
	this.damage = 2;

	return this;
};

function HeadKick()
{
	HitBox.call(this);
}
HeadKick.prototype = Object.create(HitBox.prototype);
HeadKick.prototype.constructor = HeadKick;

HeadKick.prototype.init = function(owner, enemy)
{
	this.initWithDimensionsAndPlayers(100, 50, 50, owner, enemy);

	owner.setInactionableFrames(40);

	owner.getCollider().setXVelocity(0);

	owner.getCollider().getNode().add(this.collider.getNode());

	this.attackType = "melee";
	
	var xstart = this.collider.getWidth()/2 + owner.getCollider().getWidth()/2;
	var ystart = -this.collider.getHeight()/2;
	
	this.collider.setPosition(xstart, ystart, 0);
	this.collider.setRo(xstart, ystart, 0);

	this.initialXVelocity = 0;
	this.initialYVelocity = 0;

	this.beginTime = 3;

	this.endTime = 12;
	
	this.damage = 2;

	return this;
};