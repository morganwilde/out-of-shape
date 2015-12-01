//http://threejs.org/docs/#Reference/Core/Raycaster

function Mouse()
{
	this.camera;
	this.buttons;
	this.engine;
	this.x;
	this.y;
}

Mouse.prototype.init = function(camera, engine)
{
	this.camera = camera;
	this.engine = engine;
	this.x = 0;
	this.y = 0;

	window.addEventListener( 'mousemove', function(event){this.onMouseMove(event)}.bind(this), false );
	    
	window.addEventListener( 'mousedown', function(event){this.onMouseDown(event)}.bind(this), false );

	window.addEventListener( 'mouseup', function(event){this.onMouseUp(event)}.bind(this), false );

	return this;
};

Mouse.prototype.onMouseDown = function(event)
{
	event.preventDefault();
	this.checkClick();
};

Mouse.prototype.onMouseUp = function(event)
{
	event.preventDefault();
};

Mouse.prototype.onMouseMove = function(event)
{
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	this.x = (event.clientX / window.innerWidth ) * 2 - 1;
	this.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
};


http://stackoverflow.com/questions/27703315/collada-3d-object-mouse-event
Mouse.prototype.checkClick = function()
{
	var vector = new THREE.Vector3( this.x, this.y, this.camera.near );
	vector.unproject(this.camera);

	var raycaster = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( this.engine.getButtonArray(), false );

	if(intersects.length>0)
	{
		intersects[0].object.userData.onClick();
	}
};