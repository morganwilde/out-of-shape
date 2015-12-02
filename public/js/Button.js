function Button()
{
	this.width;
	this.height;
	this.node;
	this.text;
	this.buttonType;
}

Button.prototype.initWithDimensions = function(x, y, width, height, text, buttonType)
{
	this.buttonType = buttonType;

	this.width = width;
	this.height = height;
	this.text = document.createElement('div');
	this.text.innerHTML = text;
	this.text.style.color = '#ffffff';
	this.text.style.fontSize = "24px";
	this.text.style.textAlign = "center";
	this.text.style.width = width;
	this.text.style.height = height;
	//this.text.style.backgroundColor = "blue";
	this.text.style.top = toXYCoords(new THREE.Vector3(x, y+24, 0)).y + 'px';
	this.text.style.left = toXYCoords(new THREE.Vector3(x-text.length*10, y, 0)).x + 'px';
	this.text.style.position = 'absolute';

	document.body.appendChild(this.text);

	var geometry = new THREE.PlaneGeometry(this.width, this.height);

	var material = new THREE.MeshPhongMaterial({
		color: 0xff0000,
		wireframe: false,
		specular: 0x000000,
		shininess: 30,
		shading: THREE.FlatShading
	});

	this.node = new THREE.Mesh(geometry, material);
	this.node.userData = this;

	this.node.position.x = x;
	this.node.position.y = y;

	return this;

	//http://stackoverflow.com/questions/15248872/dynamically-create-2d-text-in-three-js
	function toXYCoords (pos)
	{
        var vector = pos.clone();
        vector.project(gameEngine.camera);
        vector.x = (vector.x + 1)/2 * gameEngine.width;
        vector.y = -(vector.y - 1)/2 * gameEngine.height;
        return vector;
	}
};

Button.prototype.getNode = function()
{
	return this.node;
};

Button.prototype.getTextDiv = function()
{
	return this.text;
};

Button.prototype.onClick = function()
{
	if(this.buttonType == "Fight")
	{
		if(gameEngine.arena!=null)
		{
			gameEngine.scene.remove(gameEngine.arena.getRootObject());
			gameEngine.arena = null;
		}
		gameEngine.startFight();
		gameEngine.deleteButton(this);
	}
};