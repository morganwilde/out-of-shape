function Player2Class()
{
   PlayerCharacter.call(this);
}

Player2Class.prototype = Object.create(PlayerCharacter.prototype);
Player2Class.prototype.constructor = Player2Class;

Player2Class.prototype.initWithDimensionsAndArena = function(width, height, depth, arena, healthChangeFunction, playerDeathFunction)
{
    PlayerCharacter.prototype.initWithDimensionsAndArena.call(this, width, height, depth, arena, healthChangeFunction, playerDeathFunction);

   this.walkSpeed = 1;
   this.dashSpeed = 2;
   this.jumpSpeed = 15;

    this.collider.setGravity(2);
    this.collider.getNode().name = "P2 Collider";

    // character body
    var headSizeInRelationToBody = 0.25;
    var geometry = new THREE.BoxGeometry(
        width, 
        height, 
        depth
    );
    var material = new THREE.MeshPhongMaterial({
        color: this.bodyColor,
        wireframe: false,
        specular: 0x000000, 
        shininess: 0, 
        shading: THREE.FlatShading
    });

    var head = new THREE.Mesh(geometry, material);
    head.name = "P2 Body";
    head.position.x = 0;
    head.position.y = 0;
    head.position.z = 0;
    
    head.castShadow = true;
    head.receiveShadow = true;
    this.collider.getNode().add(head);


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