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
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshPhongMaterial({color: this.bodyColor, shading: THREE.FlatShading});

    var headHeight = height * 0.3;
    var legHeight = height * 0.4;
    var bodyHeight = height * 0.6;
    var body = this.createObject3D('BoxGeometry', width, bodyHeight, depth, 0xc0392b, 0, legHeight/2, 0, 'P2 Body');
    this.collider.getNode().add(body);

    var headWidth = 4;
    var headDepth = 4;
    var headPositionY = bodyHeight/2 + headHeight/2;
    var headPositionX = 0;
    var headPositionZ = 0;
    var head = this.createObject3D('BoxGeometry', headWidth, headHeight, headDepth, 0xf39c12, headPositionX, headPositionY, headPositionZ, 'P2 Head');
    body.add(head);

    var helmetExtendsBy = 0.2;
    var helmetWidth = headWidth * (1 + helmetExtendsBy);
    var helmetHeight = headHeight * (1 + helmetExtendsBy);
    var helmetDepth = headDepth * (1 + helmetExtendsBy);
    var helmet = this.createObject3D('BoxGeometry', helmetWidth, helmetHeight, helmetDepth, 0x16a085, -helmetWidth * 0.3, 0, 0, 'P2 Helmet');
    head.add(helmet);

    // Helmet horns
    var helmetHornBottomLenght = helmetWidth * 0.5;
    var helmetHornTopLength = helmetHeight;
    var helmetHornBottomPositionZ = helmetDepth/2 + helmetHornBottomLenght/2;
    var helmetHornTopPositionY = helmetHornTopLength/2;
    var helmetHornTopPositionZ = helmetHornBottomPositionZ + helmetHornBottomLenght/2 - 1/2;
    
    var helmetHornRightBottom = this.createObject3D('BoxGeometry', 2, 2, helmetHornBottomLenght, 0xc0392b, 0, 0, -helmetHornBottomPositionZ, 'P2 L Horn Bottom');
    helmet.add(helmetHornRightBottom);
    var helmetHornRightTop = this.createObject3D('BoxGeometry', 2, helmetHornTopLength, 1, 0xc0392b, 0, helmetHornTopPositionY, -helmetHornTopPositionZ, 'P2 L Horn Bottom');
    helmet.add(helmetHornRightTop);

    var helmetHornRightBottom = this.createObject3D('BoxGeometry', 2, 2, helmetHornBottomLenght, 0xc0392b, 0, 0, helmetHornBottomPositionZ, 'P2 R Horn Bottom');
    helmet.add(helmetHornRightBottom);
    var helmetHornRightTop = this.createObject3D('BoxGeometry', 2, helmetHornTopLength, 1, 0xc0392b, 0, helmetHornTopPositionY, helmetHornTopPositionZ, 'P2 R Horn Bottom');
    helmet.add(helmetHornRightTop);

    var armHeight = bodyHeight * 0.8;
    var armPositionY = bodyHeight/2 - armHeight/2;
    var leftArm = this.createObject3D('BoxGeometry', 2, armHeight, 2, 0x16a085, 0, armPositionY, -6, 'P2 Left Arm');
    body.add(leftArm);
    var rightArm = this.createObject3D('BoxGeometry', 2, armHeight, 2, 0x16a085, 0, armPositionY, 6, 'P2 Right Arm');
    body.add(rightArm);

    var legPositionY = -bodyHeight/2 - legHeight/2;
    var leftLeg = this.createObject3D('BoxGeometry', 4, legHeight, 4, 0x16a085, 0, legPositionY, -3, 'P2 Left Leg');
    body.add(leftLeg);
    var rightLeg = this.createObject3D('BoxGeometry', 4, legHeight, 4, 0x16a085, 0, legPositionY, 3, 'P2 Right Leg');
    body.add(rightLeg);

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

Player2Class.prototype.createObject3D = function(geometryType, width, height, depth, color, x, y, z, name)
{
  var geometry = new THREE.BoxGeometry(width, height, depth);
  var material = new THREE.MeshPhongMaterial({color: color, shading: THREE.FlatShading});
  var shape = new THREE.Mesh(geometry, material);
  shape.name = name;
  shape.position.x = x;
  shape.position.y = y;
  shape.position.z = z;
  shape.castShadow = true;
  shape.receiveShadow = true;

  return shape;
};