window.addEventListener( 'mousemove', Mouse.prototype.onMouseMove, false );
				
window.addEventListener( 'mousedown', Mouse.prototype.onMouseDown, false );

window.addEventListener( 'mouseup', Mouse.prototype.onMouseUp, false );

//http://threejs.org/docs/#Reference/Core/Raycaster

function Mouse()
{
}

Mouse.prototype.init = function()
{
};

Mouse.prototype.onMouseDown = function(event)
{
	event.preventDefault();
};

Mouse.prototype.onMouseUp = function(event)
{
	event.preventDefault();
};

Mouse.prototype.onMouseMove = function(event)
{
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	this.position.x = (event.clientX / window.innerWidth ) * 2 - 1;
	this.position.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

};

//this. 
Mouse.prototype.MouseOverObject = function()
{
	var raycaster = new THREE.Raycaster();
	var position = new THREE.Vector2();

	// update the picking ray with the camera and mouse position	
	raycaster.setFromCamera( position, camera );
	var intersects = raycaster.intersectObject( null, false );

	if(intersects.length>0)
	{
		return intersects[0].object.name;
	}
	else
	{
		return "none";
	}
}