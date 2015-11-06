function HealthBar()
{
	this.width;
	this.height;
	
	this.node;

	this.health;
	this.maxHealth;

	this.fullHealthColor;
	this.lowHealthColor;
}

HealthBar.prototype.initEmpty = function()
{
	this.width = null;
	this.height = null;
	
	this.node = null;

	this.health = null;
	this.maxHealth = null;

	this.fullHealthColor = null;
	this.lowHealthColor = null;
	
	return this;
};

HealthBar.prototype.initWithSettings = function(x, y, width, height, maxHealth, fullHealthColor, lowHealthColor)
{
	this.initEmpty();

	this.width = width;
	this.height = height;

	this.maxHealth = maxHealth;
	this.health = maxHealth;

	this.fullHealthColor = new THREE.Color(fullHealthColor);
	this.lowHealthColor = new THREE.Color(lowHealthColor);

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
	material = new THREE.MeshBasicMaterial( {color: this.fullHealthColor, side: THREE.DoubleSide} );

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
	var currentColor = this.node.children[0].material.color.clone();

	currentColor.addColors(this.node.children[0].material.color, this.lowHealthColor);
	this.node.children[0].material.color.set(currentColor);

	if(this.health <= 0)
	{
		this.health = 0;
		this.node.children[0].scale.x = .0001;
	}

	if(this.health != 0)
	{
		this.node.children[0].scale.x = this.health / this.maxHealth;
	}

	this.node.children[0].position.x -= damage*3/(this.maxHealth/100);
};
