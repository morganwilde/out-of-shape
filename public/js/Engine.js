function Engine()
{
  // Canvas container
  this.canvasContainer;
  this.canvasContainerFrame;
  // Canvas size
  this.width;
  this.height;
  // THREE
  this.scene;
  this.camera;
  this.renderer;
  this.hemisphereLight;
  this.directionalLight;
  this.arena;
  // Mode
  this.mode;
  this.gameState;
  // Arena placeholder
  this.arenaPlaceholder;
  // UI
  this.engineOverlayElement;
  this.fightButton;
  this.keyboard;
  // Animation
  this.arenaLiftAnimation;
  this.arenaRotationAnimation;
}

Engine.cameraFieldOfViewAngle = 45; // degrees
// Positioning
Engine.arenaPlaceholderPaddingHorizontal = 50; // px
Engine.arenaPlaceholderPaddingBottom = 50; // px
Engine.healthBarPlaceholderPaddingTop = 50; // px
Engine.healthBarPlaceholderPaddingLeft = 50; // px
Engine.healthBarPlaceholderHorizontalSpacing = 50; // px
// Sizing
Engine.arenaPlaceholderHeight = 50; // px
Engine.healthBarPlaceholderWidthRelativeToArena = 0.5; // percent
Engine.healthBarPlaceholderHeight = 50; // px
// Relative sizing = Arena placeholder width/depth
Engine.relativeSizingBase = 100; // 3D length
Engine.relativeFarCameraDistance = 50; // number of times greater than Engine.relativeSizingBase
Engine.relativeHorizontalPlaneSize = 100; // number of times greater than Engine.relativeSizingBase
// Shadow related
Engine.shadowCameraDistance = 3 * Engine.relativeSizingBase;
Engine.shadowCameraLevelOfDetail = 10; // Higher is more detailed, 1 is the base value
Engine.shadowDarness = 0.5; // 0 - completely transparent, 1 - completely opaque
// User Interface
Engine.userPromptFrameWidth = 200; // px
Engine.userPromptFrameHeight = 100; // px

// Initialisers

Engine.prototype.initEmpty = function()
{
  // Canvas container
  this.canvasContainer = null;
  this.canvasContainerFrame = null;
  // Canvas size
  this.width = null;
  this.height = null;
  // THREE
  this.scene = null;
  this.camera = null;
  this.renderer = null;
  this.lights = null;
  this.arena = null;
  // Mode
  this.mode = Engine.modeRegular;
  this.gameState = null;
  // Arena placeholder
  this.arenaPlaceholder = null;
  // UI
  this.engineOverlayElement = null;
  this.fightButton = null;
  this.keyboard = null;
  // Animation
  this.arenaLiftAnimation = null;
  this.arenaRotationAnimation = null;

  return this;
};

Engine.prototype.initWithCanvasContainerId = function(canvasContainerId)
{
  this.initEmpty();

  this.canvasContainer = document.querySelector('#' + canvasContainerId);
  this.canvasContainerFrame = this.canvasContainer.getBoundingClientRect();

  // Renderer
  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setClearColor(0xeeeeee);
  this.renderer.setSize(this.canvasContainerFrame.width, this.canvasContainerFrame.height);
  this.renderer.gammaInput = true;
  this.renderer.gammaOutput = true;
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.cullFace = THREE.CullFaceBack;
  this.canvasContainer.appendChild(this.renderer.domElement);

  // Scene
  this.scene = new THREE.Scene();
  
  // Camera
  var fieldOfView = Engine.cameraFieldOfViewAngle;
  var ratio = this.canvasContainerFrame.width/this.canvasContainerFrame.height;
  var near = 1;
  var far = Engine.relativeSizingBase * Engine.relativeFarCameraDistance;
  this.camera = new THREE.PerspectiveCamera(
    fieldOfView, 
    ratio, 
    near, 
    far
  );
  this.adjustCameraPositionBasedOnBaseSizeAndArenaPlaceholder();

  // Ground Plane
  var groundGeo = new THREE.PlaneGeometry(
    Engine.relativeSizingBase * Engine.relativeHorizontalPlaneSize, 
    Engine.relativeSizingBase * Engine.relativeHorizontalPlaneSize
  );
  var groundMat = new THREE.MeshPhongMaterial({
    color: 0xbdc3c7,
    specular: 0x000000 
  });

  var ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI/2; // 90 degrees
  ground.position.y = this.arenaPlaceholder.position.y - Engine.relativeSizingBase * 0.05;
  ground.receiveShadow = true;
  this.scene.add(ground);

  // Hemisphere Light
  this.hemisphereLight = new THREE.HemisphereLight(0x34495e, 0xffffff, 0.6);
  this.hemisphereLight.position.set(0, Engine.relativeSizingBase, 0);
  this.scene.add(this.hemisphereLight);

  // Directional Light
  this.directionalLight = this.createDirectionalLightWithRelativePosition(0, 5, -5);
  this.scene.add(this.directionalLight);

  // this.scene.add(this.createDirectionalLightWithRelativePosition(0, 3, -2));

  // Game
  this.gameState = "Intro";

  // Health Bars
  var arenaScreenWidth = this.canvasContainerFrame.width - 2 * Engine.arenaPlaceholderPaddingHorizontal;
  var healtBarWidth = arenaScreenWidth * Engine.healthBarPlaceholderWidthRelativeToArena - Engine.healthBarPlaceholderHorizontalSpacing / 2;
  var healthBarLeft = new UIHealthBar().initWithSizeAndPosition(
    healtBarWidth,
    Engine.healthBarPlaceholderHeight,
    Engine.healthBarPlaceholderPaddingLeft,
    Engine.healthBarPlaceholderPaddingTop,
    'Bilbo',
    1
  );
  var healthBarRight = new UIHealthBar().initWithSizeAndPosition(
    healtBarWidth,
    Engine.healthBarPlaceholderHeight,
    Engine.healthBarPlaceholderPaddingLeft + healtBarWidth + Engine.healthBarPlaceholderHorizontalSpacing,
    Engine.healthBarPlaceholderPaddingTop,
    'Sauron',
    0.5
  );

  this.canvasContainer.appendChild(healthBarLeft.getElement());
  this.canvasContainer.appendChild(healthBarRight.getElement());

  // User Interface for starting a fight
  this.engineOverlayElement = new UIEngineOverlay().initWithSizeAndPosition(
    this.canvasContainerFrame.width,
    this.canvasContainerFrame.height,
    0,
    0
  );
  this.fightButton = new UIButton().initWithSizePositionAndText(
    Engine.userPromptFrameWidth,
    Engine.userPromptFrameHeight,
    this.canvasContainerFrame.width/2 - Engine.userPromptFrameWidth/2,
    this.canvasContainerFrame.height/2 - Engine.userPromptFrameHeight/2,
    'Fight',
    function() {
      this.startFight();
      this.didStartFight();
    }.bind(this)
    // this.startFight.bind(this)
  );

  this.canvasContainer.appendChild(this.engineOverlayElement.getElement());
  this.canvasContainer.appendChild(this.fightButton.getElement());

  this.keyboard = new Keyboard().initEmpty();
  
  return this;
};

// Getters

Engine.prototype.getScene = function()
{
  return this.scene;
};
Engine.prototype.getCamera = function()
{
  return this.camera;
};
Engine.prototype.getDirectionalLight = function()
{
  return this.directionalLight;
};
Engine.prototype.getHemisphereLight = function()
{
  return this.hemisphereLight;
};

// Setters

Engine.prototype.createDirectionalLightWithRelativePosition = function(x, y ,z)
{
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(
    x * Engine.relativeSizingBase, 
    y * Engine.relativeSizingBase, 
    z * Engine.relativeSizingBase
  );

  directionalLight.castShadow = true;
  directionalLight.shadowDarkness = Engine.shadowDarness;
  directionalLight.shadowBias = -0.01;
  
  // How much blur is added to the shadows
  directionalLight.shadowMapWidth = Engine.shadowCameraLevelOfDetail * Engine.shadowCameraDistance;
  directionalLight.shadowMapHeight = Engine.shadowCameraLevelOfDetail * Engine.shadowCameraDistance;
  
  directionalLight.shadowCameraLeft = -Engine.shadowCameraDistance;
  directionalLight.shadowCameraRight = Engine.shadowCameraDistance;
  directionalLight.shadowCameraTop = Engine.shadowCameraDistance;
  directionalLight.shadowCameraBottom = -Engine.shadowCameraDistance;

  directionalLight.shadowCameraFar = 10 * Engine.relativeSizingBase;

  return directionalLight;
};

// Methods

Engine.prototype.render = function()
{
  requestAnimationFrame(function() {
    // Debug
    if (window.consoleDelegate instanceof ConsoleDelegate) {
      window.consoleDelegate.debug();
    }
    if (this.arenaRotationAnimation > 0) {
      this.arenaRotationAnimation -= this.arenaRotationAnimationIncrement;
      this.arenaLiftAnimation -= this.arenaLiftAnimationIncrement;
      this.arena.getObject3D().position.y = this.arenaLiftAnimation;
      this.arena.getObject3D().rotation.y = (this.arenaRotationAnimation / 180) * Math.PI;
    }
    // Regular
    this.render();
  }.bind(this));

  this.renderer.render(this.scene, this.camera);

  if (this.gameState == "Fight") {
    this.arena.update();
    this.keyboard.updateKeyBuffers();
  }

  
};

// Relative sizing

Engine.prototype.adjustCameraPositionBasedOnBaseSizeAndArenaPlaceholder = function()
{
  this.camera.position.z = Engine.relativeSizingBase;
  var placeholder = this.calculateArenaPlaceholderSizeAndPosition();
  this.camera.position.z = this.camera.position.z * (this.camera.position.z / placeholder.width);
  this.arenaPlaceholder = this.calculateArenaPlaceholderSizeAndPosition();
};

// Arena

Engine.prototype.calculateArenaPlaceholderSizeAndPosition = function()
{
  // Bounding box in screen space
  var width = this.canvasContainerFrame.width - 2 * Engine.arenaPlaceholderPaddingHorizontal;
  var height = Engine.arenaPlaceholderHeight;
  var left = Engine.arenaPlaceholderPaddingHorizontal;
  var top = this.canvasContainerFrame.height - height - Engine.arenaPlaceholderPaddingBottom;

  // Debugging - no longer active, but maybe useful in the future, so keep!
  if (false) {
    // This draws the bounding box inside of the container div.
    // The bounding box should equal the size and position of the front side
    // of the arena box.
    var boundingElement = document.createElement('div');
    boundingElement.classList.add('bounding');
    boundingElement.classList.add('background-red');
    boundingElement.style.top = top + 'px';
    boundingElement.style.left = left + 'px';
    boundingElement.style.width = width + 'px';
    boundingElement.style.height = height + 'px';
    this.canvasContainer.appendChild(boundingElement);
  }

  // Normalize width and height
  var widthNormalized = (width / this.canvasContainerFrame.width);
  var heightNormalized = (height / this.canvasContainerFrame.height);

  var topRightCornerVector = new THREE.Vector3(
    widthNormalized / 2,
    heightNormalized / 2,
    1 / 2
  );
  topRightCornerVector.unproject(this.camera);
  var topRightCornerVectorProjected = this.camera.position.clone().add(
    topRightCornerVector.multiplyScalar(this.camera.position.z / 2)
  );
  
  var placeholderWidth = topRightCornerVectorProjected.x * 2;
  var placeholderHeight = topRightCornerVectorProjected.y * 2;
  var placeholderDepth = placeholderWidth;

  // Normalize and center top position because screen space is centered
  // in top left corner.
  var topNormalized = (top / this.canvasContainerFrame.height) * 2 - 1;

  var positionVector = new THREE.Vector3(
    0,
    topNormalized / 2,
    1 / 2
  );
  positionVector.unproject(this.camera);
  var positionVectorProjected = this.camera.position.clone().add(
    positionVector.multiplyScalar(this.camera.position.z / 2)
  );

  return {
    width: placeholderWidth,
    height: placeholderHeight,
    depth: placeholderDepth,
    position: new THREE.Vector3(
      0,
      -positionVectorProjected.y - topRightCornerVectorProjected.y,
      -placeholderDepth/2
    )
  };
};
Engine.prototype.createArena = function()
{
  this.arenaPlaceholder = this.calculateArenaPlaceholderSizeAndPosition();
  this.arena = new Arena().initWithDimensions(
    this.arenaPlaceholder.width,
    this.arenaPlaceholder.height,
    this.arenaPlaceholder.depth,
    this.arenaPlaceholder.position
  );
  this.scene.add(this.arena.getObject3D());
};
Engine.prototype.getArena = function()
{
  return this.arena;
};

// Game

Engine.prototype.startFight = function()
{
  // Destroy the UI
  this.engineOverlayElement.destroy();
  this.fightButton.destroy();

  // Add players
  var playerWidth = 10;
  var playerHeight = 18;
  var playerDepth = 10;
  this.arena.addPlayerCharacter(new SuperStar().initWithDimensionsAndArena(playerWidth, playerHeight, playerDepth, this.getArena()));
  // this.arena.player1.setKeys(38, 40, 37, 39, 80, 219, 73, 221, 79, 76, 77);

  this.arena.addPlayerCharacter(new SuperStar().initWithDimensionsAndArena(playerWidth, playerHeight, playerDepth, this.getArena()));
  // this.arena.player2.setKeys(87, 83, 65, 68, 82, 84, 85, 89, 90, 71, 72);
  
  // Keyboard controls
  this.keyboard.setKeys(this.arena.player1, 38, 40, 37, 39, "P".charCodeAt(0),  "J".charCodeAt(0),  "O".charCodeAt(0),  "U".charCodeAt(0),  "I".charCodeAt(0),  "L".charCodeAt(0),  "K".charCodeAt(0));
  this.keyboard.setKeys(this.arena.player2, "W".charCodeAt(0),  "S".charCodeAt(0), "A".charCodeAt(0),  "D".charCodeAt(0),  "E".charCodeAt(0),  "R".charCodeAt(0),  "F".charCodeAt(0),  "G".charCodeAt(0),  "T".charCodeAt(0),  "C".charCodeAt(0),  "V".charCodeAt(0));

  this.gameState = "Fight";
};
Engine.prototype.didStartFight = function()
{
  this.animateArenaIntoView();
};
Engine.prototype.getGameState = function()
{
  return this.gameState;
};

Engine.prototype.setGameState = function(state)
{
  this.gameState = state;
};

// Animations

Engine.prototype.animateArenaIntoView = function()
{
  this.arenaRotationAnimation = 180;
  this.arenaLiftAnimation = Engine.relativeSizingBase;

  this.arenaRotationAnimationIncrement = 2.5;
  this.arenaLiftAnimationIncrement = this.arenaRotationAnimationIncrement * (this.arenaLiftAnimation - this.getArena().getObject3D().position.y) / this.arenaRotationAnimation;
};