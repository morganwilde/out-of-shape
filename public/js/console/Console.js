var Console = React.createClass({
  getInitialState: function() {
    return {
      // Rotation
      rotationX: window.consoleDelegate.rotationX / Math.PI * 180,
      rotationY: window.consoleDelegate.rotationY / Math.PI * 180,
      rotationZ: window.consoleDelegate.rotationZ / Math.PI * 180,
      // Position
      positionX: window.consoleDelegate.positionX,
      positionY: window.consoleDelegate.positionY,
      positionZ: window.consoleDelegate.positionZ,
    };
  },
  // Event Listeners
  targetHasChanged: function() {
    this.setState({
      // Rotation
      rotationX: window.consoleDelegate.rotationX / Math.PI * 180,
      rotationY: window.consoleDelegate.rotationY / Math.PI * 180,
      rotationZ: window.consoleDelegate.rotationZ / Math.PI * 180,
      // Position
      positionX: window.consoleDelegate.positionX,
      positionY: window.consoleDelegate.positionY,
      positionZ: window.consoleDelegate.positionZ,
    }, function() {
      var refs = Object.keys(this.refs);
      for (var i = refs.length - 1; i >= 0; i--) {
        var refName = refs[i];
        this.refs[refName].forceUpdate();
      }
    }.bind(this));
  },
  // Component Lifecycle
  componentDidMount: function() {
    window.addEventListener('consoleTargetChanged', this.targetHasChanged);
  },
  componentWillUnmount: function() {
    window.removeEventListener('consoleTargetChanged', this.targetHasChanged);
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
  onAttributeChange: function(attributeName, attributeValue) {
    switch (attributeName) {
      // Rotation
      case 'Rotation X': window.consoleDelegate.rotationX = attributeValue * Math.PI / 180; break;
      case 'Rotation Y': window.consoleDelegate.rotationY = attributeValue * Math.PI / 180; break;
      case 'Rotation Z': window.consoleDelegate.rotationZ = attributeValue * Math.PI / 180; break;
      // Position
      case 'Position X': window.consoleDelegate.positionX = attributeValue; break;
      case 'Position Y': window.consoleDelegate.positionY = attributeValue; break;
      case 'Position Z': window.consoleDelegate.positionZ = attributeValue; break;
      // Bounding Box
      case 'Vertex Collection': window.consoleDelegate.toggleTargetsVertexCollection(); break;
      case 'Vertex DOM': window.consoleDelegate.toggleTargetsVertexCollectionDOMProjection(); break;
      case 'Bounding Box DOM': window.consoleDelegate.toggleTargetsBoundingBoxDOMProjection(); break;
    }
  },
  render: function() {
    console.log(this.state.positionX);
    // Rotation
    var rotationXAngleElement = makeConsoleAngleAttribute('Rotation X', this.state.rotationX, 0, 360, this.onAttributeChange);
    var rotationYAngleElement = makeConsoleAngleAttribute('Rotation Y', this.state.rotationY, 0, 360, this.onAttributeChange);
    var rotationZAngleElement = makeConsoleAngleAttribute('Rotation Z', this.state.rotationZ, 0, 360, this.onAttributeChange);
    // Position
    var positionXElement = makeConsolePositionAttribute('Position X', this.state.positionX, -5000, 3000, this.onAttributeChange);
    var positionYElement = makeConsolePositionAttribute('Position Y', this.state.positionY, -5000, 3000, this.onAttributeChange);
    var positionZElement = makeConsolePositionAttribute('Position Z', this.state.positionZ, -5000, 3000, this.onAttributeChange);

    if (window.consoleDelegate.hasTarget()) {
      var consoleElement = React.createElement('div', null,
        React.createElement('h3', null, 'Rotation'),
        rotationXAngleElement,
        rotationYAngleElement,
        rotationZAngleElement,
        React.createElement('h3', null, 'Position'),
        positionXElement,
        positionYElement,
        positionZElement,
        React.createElement('h3', null, 'Bounding Box'),
        React.createElement(ConsoleToggle, {attributeName: 'Vertex Collection', onAttributeChange: this.onAttributeChange}),
        React.createElement(ConsoleToggle, {attributeName: 'Vertex DOM', onAttributeChange: this.onAttributeChange}),
        React.createElement(ConsoleToggle, {attributeName: 'Bounding Box DOM', onAttributeChange: this.onAttributeChange})
      );
    } else {
      var consoleElement = React.createElement('div', {style: {textAlign: 'center'}},
        'No target selected'
      )
    }

    return (
      React.createElement('div', {className: 'container-fluid'},
        consoleElement
      )
    );
  }
});