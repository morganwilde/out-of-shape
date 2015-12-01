/**
* Class responsible for visually indicating the health of a PlayerCharacter.
*
* @constructor
*/
function HealthBar()
{
	/** @property {float} width - The width of the HealthBar's THREE.Object3D. */
	this.width;
	/** @property {float} height - The height of the HealthBar's THREE.Object3D. */
	this.height;

	/** @property {Object3D} node - The rendered polygon (THREE.Object3D) that represents the HealthBar instance. */
	this.node;

	/** @property {float} health - The current amount of health of the PlayerCharacter that corresponds to this HealthBar. */
	this.health;
	/** @property {float} maxHealth - The maximum amount of health of the PlayerCharacter that corresponds to this HealthBar. */
	this.maxHealth;
}

/**
* Creates a new instance of HealthBar. All instance variables default to null.
* 
* @return {HealthBar} The HealthBar instance that is created.
*/
HealthBar.prototype.initEmpty = function()
{
	this.width = null;
	this.height = null;
	
	this.node = null;

	this.health = null;
	this.maxHealth = null;

	return this;
};

/**
* Creates a new instance of HealthBar with specific dimensions, and a PlayerCharacter's maximum health.
* 
* @return {HealthBar} The HealthBar instance that is created.
*/
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

/**
* Returns the THREE.Object3D belonging to this instance.
* 
* @return {THREE.Object3D} The Object3D of the instance.
*/
HealthBar.prototype.getNode = function()
{
	return this.node;
};

HealthBar.prototype.getHealth = function()
{
	return this.health;
};

// Setters

/**
* Sets the current health of a PlayerCharacter based on a given damage value.
* 
* @param {float} damage - The float value that will be subtracted from the PlayerCharacter's health.
*/
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