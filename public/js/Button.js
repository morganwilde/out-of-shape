function Button()
{
	this.width;
	this.height;
	this.node;
	this.text;
	this.buttonType;
	this.engine;
}

Button.prototype.initWithDimensions = function(x, y, width, height, text, buttonType, engine)
{
	this.buttonType = buttonType;
	this.engine = engine;

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
	this.text.style.top = this.toXYCoords(new THREE.Vector3(x, y+24, 0)).y + 'px';
	this.text.style.left = this.toXYCoords(new THREE.Vector3(x-text.length*10, y, 0)).x + 'px';
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
	
};

Button.prototype.toXYCoords = function  (pos)
{
    var vector = pos.clone();
    vector.project(this.engine.camera);
    vector.x = (vector.x + 1)/2 * this.engine.width;
    vector.y = -(vector.y - 1)/2 * this.engine.height;
    return vector;
}

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
		if(this.engine.getArena()!=null)
		{
			this.engine.scene.remove(this.engine.getArena().getObject3D());
			this.engine.arena = null;
		}
		this.engine.startFight();
		this.engine.deleteButton(this);
	}
};