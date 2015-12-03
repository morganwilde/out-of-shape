function UIHealthBar()
{
   this.element;
   this.healthIndicatorPercentage;
}

UIHealthBar.prototype.initEmpty = function()
{
   this.element = null;
   this.healthIndicatorPercentage = null;

   return this;
};
UIHealthBar.prototype.initWithSizeAndPosition = function(width, height, left, top, playerName, healthIndicatorPercentage)
{
   this.initEmpty();

   this.healthIndicatorPercentage = healthIndicatorPercentage;

   // The container frame
   this.element = document.createElement('div');
   this.element.classList.add('ui-healthbar');
   this.element.style.top = top + 'px';
   this.element.style.left = left + 'px';
   this.element.style.width = width + 'px';
   this.element.style.height = height + 'px';

   // The dynamic health indicator
   var padding = 10; // px
   this.healthIndicatorElement = document.createElement('div');
   this.healthIndicatorElement.classList.add('ui-healthbar-indicator');
   this.healthIndicatorElement.style.top = padding + 'px';
   this.healthIndicatorElement.style.left = padding + 'px';
   this.healthIndicatorElement.style.width = (width - 2*padding) * this.healthIndicatorPercentage + 'px';
   this.healthIndicatorElement.style.height = (height - 2*padding) + 'px';

   this.element.appendChild(this.healthIndicatorElement);

   this.playerNameContainerElement = document.createElement('div');
   this.playerNameContainerElement.classList.add('ui-healthbar-text-container');
   this.playerNameContainerElement.style.top = padding + 'px';
   this.playerNameContainerElement.style.left = padding + 'px';
   this.playerNameContainerElement.style.width = (width - 2*padding) + 'px';
   this.playerNameContainerElement.style.height = (height - 2*padding) + 'px';
   this.playerNameContainerElement.appendChild(document.createTextNode(playerName));

   this.element.appendChild(this.playerNameContainerElement);

   return this;
};

// Getters

UIHealthBar.prototype.getElement = function()
{
   return this.element;
};

// Methods

UIHealthBar.prototype.destroy = function()
{
   this.element.parentElement.removeChild(this.element);
};