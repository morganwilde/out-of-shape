function HealthBar()
{
	this.width;
	this.height;
	
	this.node;

	this.health;
	this.maxHealth;
}

HealthBar.prototype.initEmpty = function()
{
	this.width = null;
	this.height = null;
	
	this.node = null;

	this.health = null;
	this.maxHealth = null;

	return this;
};

HealthBar.prototype.initWithSettings = function(x, y, width, height, maxHealth)
{
	this.initEmpty();

	this.width = width;
	this.height = height;

	this.maxHealth = maxHealth;
	this.health = maxHealth;

	var fullHealthColor = 0x00ff00;

	var outlineColor = 0x000000;
	var margin = 25;

	// Outline

	var geometry = new THREE.PlaneGeometry( this.width + margin, this.height + margin, 32 );
	var material = new THREE.MeshBasicMaterial( {color: outlineColor, side: THREE.DoubleSide} );

	this.node = new THREE.Mesh( geometry, material );

	this.node.position.x = x;
	this.node.position.y = y;

	// Inner Bar

	geometry = new THREE.PlaneGeometry( this.width, this.height, 32 );
	material = new THREE.MeshBasicMaterial( {color: fullHealthColor, side: THREE.DoubleSide} );

	this.node.children[0] =( new THREE.Mesh( geometry, material ) );

	this.node.children[0].position.x = x;
	this.node.children[0].position.y = y;

	return this;
};

// Getters

HealthBar.prototype.getNode = function()
{
	return this.node;
};

// Setters

HealthBar.prototype.takeDamage = function(damage)
{
	this.health -= damage;

	var healthPercent = this.health / this.maxHealth;

	this.node.children[0].material.color.r = (1 - healthPercent) * 2;
	this.node.children[0].material.color.g = healthPercent * 2;

	if(this.health <= 0)
	{
		this.health = 0;
		this.node.children[0].scale.x = .0001;
	}

	if(this.health != 0)
	{
		this.node.children[0].scale.x = healthPercent;
	}

	this.node.children[0].position.x -= damage * this.width / (2 * this.maxHealth);
};