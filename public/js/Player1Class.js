function Player1Class()
{
   PlayerCharacter.call(this);
}

Player1Class.prototype = Object.create(PlayerCharacter.prototype);
Player1Class.prototype.constructor = Player1Class;

Player1Class.prototype.initWithDimensionsAndArena = function(width, height, depth, arena, healthChangeFunction, playerDeathFunction)
{
    PlayerCharacter.prototype.initWithDimensionsAndArena.call(this, width, height, depth, arena, healthChangeFunction, playerDeathFunction);

   this.walkSpeed = 1;
   this.dashSpeed = 2;
   this.jumpSpeed = 15;

    this.collider.setGravity(2);
    this.collider.getNode().name = "P1 Collider";

    // character body
    var headSizeInRelationToBody = 0.3;
    var armSizeInRelationToBody = 0.25;
    var geometry = new THREE.SphereGeometry(
        width/2, 
        100, 
        100
    );
    var material = new THREE.MeshPhongMaterial({
        color: this.bodyColor,
        wireframe: false,
        specular: 0x000000, 
        shininess: 0, 
        shading: THREE.FlatShading
    });

    var body = new THREE.Mesh(geometry, material);
    body.name = "P1 Body";
    body.position.x = 0;
    body.position.y = 0;
    body.position.z = 0;
    
    body.castShadow = true;
    body.receiveShadow = true;
    this.collider.getNode().add(body);

    var headGeometry = new THREE.SphereGeometry(
        headSizeInRelationToBody * width, 
        100, 
        100
    );

    var headMaterial = new THREE.MeshPhongMaterial({
        color: 0xc0392b,
        wireframe: false,
        specular: 0x000000, 
        shininess: 0, 
        shading: THREE.FlatShading
    });

    var head = new THREE.Mesh(headGeometry, headMaterial);
    head.name = "P1 Head";
    head.position.x = .6;
    head.position.y = 7;
    head.position.z = 0;
    
    head.castShadow = true;
    head.receiveShadow = true;
    this.collider.getNode().add(head);

    var legs = new THREE.Mesh(geometry, material);
    legs.name = "P1 Legs";
    legs.position.x = 0;
    legs.position.y = -4;
    legs.position.z = 0;
    
    legs.castShadow = true;
    legs.receiveShadow = true;
    this.collider.getNode().add(legs);

    var armGeometry = new THREE.CylinderGeometry(
        3, 
        3, 
        armSizeInRelationToBody * width
    );

    var armMaterial = new THREE.MeshPhongMaterial({
        color: 0x16a085,
        wireframe: false,
        specular: 0x000000, 
        shininess: 0, 
        shading: THREE.FlatShading
    });

    var leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.name = "P1 Left Arm";
    leftArm.position.x = 3;
    leftArm.position.y = 0;
    leftArm.position.z = 6;
    
    leftArm.castShadow = true;
    leftArm.receiveShadow = true;
    this.collider.getNode().add(leftArm);

    var rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.name = "P1 Left Arm";
    rightArm.position.x = 3;
    rightArm.position.y = 0;
    rightArm.position.z = -6;
    
    rightArm.castShadow = true;
    rightArm.receiveShadow = true;
    this.collider.getNode().add(rightArm);

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