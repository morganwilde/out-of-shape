var Console = React.createClass({
  getInitialState: function() {
    return {
      axisX: 0,
      axisY: 0,
      axisZ: 0,
      rotation: 0
    };
  },
  // Helpers
  incrementFor: function(event, purpose) {
    if (purpose == 'rotation') {
      switch (event.keyCode) {
        case 38: // Up arrow
        case 87: // W
          return event.shiftKey ? 10 : 1
        case 40: // Down arrow
        case 83: // S
          return event.shiftKey ? -10 : -1;
      }
    }
    return 0;
  },
  // Actions
  onRotationChange: function(event) {
    var rotation = parseFloat(event.target.value);
    this.setState({
      rotation: rotation
    });
    window.engineDebug.rotation = rotation * (Math.PI / 180);
  },
  onRotationKeyDown: function(event) {
    var rotation = (this.state.rotation + this.incrementFor(event, 'rotation')) % 360;
    this.setState({
      rotation: rotation
    });
    window.engineDebug.rotation = rotation * (Math.PI / 180);
  },
  onAttributeChange: function(attributeName, attributeValue) {
    switch (attributeName) {
      case 'Azimuthal Angle': window.engineDebug.azimuthalAngle = attributeValue * Math.PI / 180; break;
      case 'Polar Angle': window.engineDebug.polarAngle = attributeValue * Math.PI / 180; break;
      case 'Rotation': window.engineDebug.rotation = attributeValue * Math.PI / 180; break;
    }
  },
  render: function() {
    var azimuthalAngleElement = makeConsoleAngleAttribute('Azimuthal Angle', -180, 180, this.onAttributeChange);
    var polarAngleElement = makeConsoleAngleAttribute('Polar Angle', -90, 90, this.onAttributeChange);
    var rotationElement = makeConsoleAngleAttribute('Rotation', 0, 360, this.onAttributeChange);
    return (
      React.createElement('div', {className: 'container-fluid'},
        React.createElement('h3', null, 'Direction'),
        azimuthalAngleElement,
        polarAngleElement,
        React.createElement('h3', null, 'Rotation'),
        rotationElement
      )
    );
  }
});