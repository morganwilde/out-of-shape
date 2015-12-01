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
  window.addEventListener('keydown', this.setKeyPress, false);
  window.addEventListener('keyup', this.setKeyRelease, false);

}

// Initialisers

Keyboard.prototype.initEmpty = function()
{
  this.keyValues = {};
  this.keyStates = {};
  this.keyBuffers = {};
  this.keyBufferTime = null;

    

  return this;
};

Keyboard.prototype.initWithKeys = function(jump, crouch, left, right, lightpunch, heavypunch, lightkick, heavykick, dash, grab, block)
{
  this.initEmpty();

  this.keyValues['jump'] = jump;
  this.keyValues['crouch'] = crouch;
  this.keyValues['left'] = left;
  this.keyValues['right'] = right;
  this.keyValues['lightpunch'] = lightpunch;
  this.keyValues['heavypunch'] = heavypunch;
  this.keyValues['lightkick'] = lightkick;
  this.keyValues['heavykick'] = heavykick;
  this.keyValues['dash'] = dash;
  this.keyValues['block'] = block;
  this.keyValues['grab'] = grab;

  this.keyStates['jump'] = false;
  this.keyStates['crouch'] = false;
  this.keyStates['left'] = false;
  this.keyStates['right'] = false;
  this.keyStates['lightpunch'] = false;
  this.keyStates['heavypunch'] = false;
  this.keyStates['lightkick'] = false;
  this.keyStates['heavykick'] = false;
  this.keyStates['dash'] = false;
  this.keyStates['block'] = false;
  this.keyStates['grab'] = false;

  this.keyBuffers['jump'] = 0;
  this.keyBuffers['crouch'] = 0;
  this.keyBuffers['left'] = 0;
  this.keyBuffers['right'] = 0;
  this.keyBuffers['lightpunch'] = 0;
  this.keyBuffers['heavypunch'] = 0;
  this.keyBuffers['lightkick'] = 0;
  this.keyBuffers['heavykick'] = 0;
  this.keyBuffers['dash'] = 0;
  this.keyBuffers['block'] = 0;
  this.keyBuffers['grab'] = 0;

  return this;
};

// Getters

Keyboard.prototype.updateKeyBuffers = function()
{
    for (var i in this.keyBuffers) {
        if (this.keyBuffers[i] > 0) {
            this.keyBuffers[i] -= 1;
        }
    }
};

Keyboard.prototype.setKeyPress = function(event)
{
  event.preventDefault();
    for (var i in this.keyValues) {
        if (event.keycode == this.keyValues[i]) {
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
        if (event.keycode == this.keyValues[i]) {
            this.keyStates[i] = false;
        }
    }
};