window.addEventListener( 'mousemove', onMouseMove, false );
				
window.addEventListener( 'mousedown', onMouseDown, false );

window.addEventListener( 'mouseup', onMouseUp, false );

//http://threejs.org/docs/#Reference/Core/Raycaster

var mouse = new Mouse();

function onMouseDown (event)
{
	event.preventDefault();
	//mouse.UpdateClick
}

function onMouseUp (event)
{
	event.preventDefault();
	//mouse.UpdateClick
}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.SetPosition(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);

}


function Mouse()
{
	var raycaster = new THREE.Raycaster();
	var position = new THREE.Vector2();
	
	this.SetPosition = function(givenx, giveny)
	{
		position.x = givenx;
		position.y = giveny;
	}
	
	//this. 
	this.MouseOverObject = function()
	{

		// update the picking ray with the camera and mouse position	
		raycaster.setFromCamera( position, camera );
		var intersects = raycaster.intersectObjects( scene.children, false );

		if(intersects.length>0)
		{
			return intersects[0].object.name;
		}
		else
		{
			return "none";
		}
	}
}
