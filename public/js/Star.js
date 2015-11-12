//https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Extrusion.html
var starPoints = [];
	
	starPoints.push( new THREE.Vector2 (   0,  50 ) );
	starPoints.push( new THREE.Vector2 (  10,  10 ) );
	starPoints.push( new THREE.Vector2 (  40,  10 ) );
	starPoints.push( new THREE.Vector2 (  20, -10 ) );
	starPoints.push( new THREE.Vector2 (  30, -50 ) );
	starPoints.push( new THREE.Vector2 (   0, -20 ) );
	starPoints.push( new THREE.Vector2 ( -30, -50 ) );
	starPoints.push( new THREE.Vector2 ( -20, -10 ) );
	starPoints.push( new THREE.Vector2 ( -40,  10 ) );
	starPoints.push( new THREE.Vector2 ( -10,  10 ) );
	
	var starShape = new THREE.Shape( starPoints );
	var extrusionSettings = {
		size: 30, height: 4, curveSegments: 3,
		bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
		material: 0, extrudeMaterial: 1
	};
	
	var starGeometry = new THREE.ExtrudeGeometry( starShape, extrusionSettings );