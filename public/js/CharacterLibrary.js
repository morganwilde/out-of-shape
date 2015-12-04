function SuperStar()
{
	PlayerCharacter.call(this);
}
SuperStar.prototype = Object.create(PlayerCharacter.prototype);
SuperStar.prototype.constructor = SuperStar;

SuperStar.prototype.initWithDimensionsAndArena = function(width, height, depth, arena, healthChangeFunction, playerDeathFunction)
{
    PlayerCharacter.prototype.initWithDimensionsAndArena.call(this, width, height, depth, arena, healthChangeFunction, playerDeathFunction);

	this.walkSpeed = 1;
	this.dashSpeed = 2;
	this.jumpSpeed = 15;

    this.collider.setGravity(2);

    // character body
    var headSizeInRelationToBody = 0.25;
    var geometry = new THREE.BoxGeometry(
        width * headSizeInRelationToBody, 
        height * headSizeInRelationToBody, 
        depth * headSizeInRelationToBody
    );
    var material = new THREE.MeshPhongMaterial({
        color: this.bodyColor,
        wireframe: false,
        specular: 0x000000, 
        shininess: 0, 
        shading: THREE.FlatShading
    });

    var head = new THREE.Mesh(geometry, material);
    head.position.y = height/2 + geometry.parameters.height / 2;
    head.position.x = width * 0.1;
    head.castShadow = true;
    head.receiveShadow = true;
    //this.collider.getNode().add(head);

    this.collider.getNode().castShadow = true;
    this.collider.getNode().receiveShadow = true;

    //attacks
    this.attacks['lightpunch'] = UpperCut;
    this.attacks['lowlightpunch'] = Jab;

    this.attacks['lightkick'] = ShootingStar;
    this.attacks['lowlightkick'] = UpperCut;

    this.attacks['heavypunch'] = HayMaker;
    this.attacks['lowheavypunch'] = StarBlast;

    this.attacks['heavykick'] = HeadKick;
    this.attacks['lowheavykick'] = SweepKick;
    this.attacks['grab'] = Grab;

    return this;
};