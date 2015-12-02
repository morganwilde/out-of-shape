function SuperStar()
{
	PlayerCharacter.call(this);
}
SuperStar.prototype = Object.create(PlayerCharacter.prototype);
SuperStar.prototype.constructor = SuperStar;

SuperStar.prototype.init = function(width, height, depth)
{
	this.initWithDimensions(width, height, depth);

	this.walkSpeed = 4;
	this.dashSpeed = 10;
	this.jumpSpeed = 30;

    this.collider.setGravity(2);

    // character body
    var geometry = new THREE.BoxGeometry(50, 50, 50);
    var material = new THREE.MeshPhongMaterial({
        color: this.bodyColor,
        wireframe: false,
        specular: 0x000000, 
        shininess: 0, 
        shading: THREE.FlatShading
    });

    var head = new THREE.Mesh(geometry, material);
    head.position.y = 75;
    head.position.x = 10;
    this.collider.getNode().add(head);

    //attacks
    this.attacks['lightpunch'] = UpperCut;
    this.attacks['lowlightpunch'] = Jab;

    this.attacks['lightkick'] = UpperCut;
    this.attacks['lowlightkick'] = UpperCut;

    this.attacks['heavypunch'] = HayMaker;
    this.attacks['lowheavypunch'] = StarBlast;

    this.attacks['heavykick'] = HeadKick;
    this.attacks['lowheavykick'] = SweepKick;
    this.attacks['grab'] = Grab;

    return this;
};