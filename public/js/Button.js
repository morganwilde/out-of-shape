function Button()
{
	this.width;
	this.height;
	this.node;
	this.text;
}

Button.prototype.initWithDimensions = function(x, y, width, height, text)
{
	this.width = width;
	this.height = height;
	this.text = document.createElement('div');
	this.text.innerHTML = text;
	this.text.style.color = '#ffffff';
	this.text.style.fontSize = "24px";
	this.text.style.width = width;
	this.text.style.height = height;
	// this.text.style.backgroundColor = "blue";
	this.text.style.top = 350 + 'px';
	this.text.style.left = 580 + 'px';
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

	this.node.position.x = x;
	this.node.position.y = y;

	return this;
};

Button.prototype.getNode = function()
{
	return this.node;
};

Button.prototype.onClick()
{
	console.log("hello world");
};
