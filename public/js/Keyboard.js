function Keyboard()
{	
  this.keyValues;

  /** @property {object} keyStates A key-value stored for character actions and a boolean indicating if they're currently active. Keeping track of a key state (up or down) is important when considering long key presses that exhaust the key buffer. */
  this.keyStates;

  /** @property {object} keyBuffers A place to store how many frames a certain key press is considered active. If a key's buffer has a value of zero, it is no longer considered in the being initially pressed, and is instead simply held or released depending on the respective keyState. */
  this.keyBuffers;
  /** @property {Integer} keyBufferTime The time limit ( frames ) that any key input is considered pressed, rather than held or released. Currently stored as 2. */
  this.keyBufferTime;

// User actions
  window.addEventListener( 'keydown', function(event){this.setKeyPress(event)}.bind(this), false );
  window.addEventListener( 'keyup', function(event){this.setKeyRelease(event)}.bind(this), false );


	// Frame window for button Press
	this.buffertime;
	
	this.keyvalue;
}

// Initialisers

Keyboard.prototype.initEmpty = function()
{
  this.keyValues = {};
  this.keyStates = {};
  this.keyBuffers = {};
  this.keyBufferTime = 10;

  return this;
};

Keyboard.prototype.setKeys = function(playerNumber, jump, duck, left, right, lightpunch, heavypunch, lightkick, heavykick, dash, grab, block)
{
  this.keyValues['jump'+playerNumber] = jump;
  this.keyValues['duck'+playerNumber] = duck;
  this.keyValues['left'+playerNumber] = left;
  this.keyValues['right'+playerNumber] = right;
  this.keyValues['lightpunch'+playerNumber] = lightpunch;
  this.keyValues['heavypunch'+playerNumber] = heavypunch;
  this.keyValues['lightkick'+playerNumber] = lightkick;
  this.keyValues['heavykick'+playerNumber] = heavykick;
  this.keyValues['dash'+playerNumber] = dash;
  this.keyValues['block'+playerNumber] = block;
  this.keyValues['grab'+playerNumber] = grab;

  this.keyStates['jump'+playerNumber] = false;
  this.keyStates['duck'+playerNumber] = false;
  this.keyStates['left'+playerNumber] = false;
  this.keyStates['right'+playerNumber] = false;
  this.keyStates['lightpunch'+playerNumber] = false;
  this.keyStates['heavypunch'+playerNumber] = false;
  this.keyStates['lightkick'+playerNumber] = false;
  this.keyStates['heavykick'+playerNumber] = false;
  this.keyStates['dash'+playerNumber] = false;
  this.keyStates['block'+playerNumber] = false;
  this.keyStates['grab'+playerNumber] = false;

  this.keyBuffers['jump'+playerNumber] = 0;
  this.keyBuffers['duck'+playerNumber] = 0;
  this.keyBuffers['left'+playerNumber] = 0;
  this.keyBuffers['right'+playerNumber] = 0;
  this.keyBuffers['lightpunch'+playerNumber] = 0;
  this.keyBuffers['heavypunch'+playerNumber] = 0;
  this.keyBuffers['lightkick'+playerNumber] = 0;
  this.keyBuffers['heavykick'+playerNumber] = 0;
  this.keyBuffers['dash'+playerNumber] = 0;
  this.keyBuffers['block'+playerNumber] = 0;
  this.keyBuffers['grab'+playerNumber] = 0;

  return this;
}

// Getters
Keyboard.prototype.getKeyState = function(keyIndex)
{
  return this.keyStates[keyIndex];
};

Keyboard.prototype.getKeyBuffer = function(keyIndex)
{
  return this.keyBuffers[keyIndex];
};

// Methods
Keyboard.prototype.updateKeyBuffers = function()
{

    for (var i in this.keyBuffers) {
        if (this.keyBuffers[i] > 0) {
            this.keyBuffers[i] -= 1;
        }
    }
};

// Setters
Keyboard.prototype.setKeyPress = function(event)
{
  event.preventDefault();
    for (var i in this.keyValues) {
        if (event.keyCode == this.keyValues[i]) {
            if (this.keyBuffers[i] == 0 && this.keyStates[i] == false) {
              // on initial press
                this.keyBuffers[i] = this.keyBufferTime;
            }
            this.keyStates[i] = true;
        }
    }
};
/**
 * Changes the state of a specific key to an inactive state.
 * 
 * @param {Character} keycode Numerical key code.
 */
Keyboard.prototype.setKeyRelease = function(event)
{
  event.preventDefault();
    for (var i in this.keyValues) {
        if (event.keyCode == this.keyValues[i]) {
            this.keyStates[i] = false;
        }
    }
}

Keyboard.prototype.press = function(keyIndex)
{
    return this.keyBuffers[keyIndex] == this.keyBufferTime;
};