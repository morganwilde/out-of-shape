function UIEngineOverlay()
{
   this.element;
}

UIEngineOverlay.prototype.initEmpty = function()
{
   this.element = null;

   return this;
};
UIEngineOverlay.prototype.initWithSizeAndPosition = function(width, height, left, top)
{
   this.initEmpty();

   this.element = document.createElement('div');
   this.element.classList.add('ui-overlay');
   this.element.style.width = width + 'px';
   this.element.style.height = height + 'px';
   this.element.style.left = left + 'px';
   this.element.style.top = top + 'px';

   return this;
};

// Getters

UIEngineOverlay.prototype.getElement = function()
{
   return this.element;
};

// Methods

UIEngineOverlay.prototype.destroy = function()
{
   this.element.parentElement.removeChild(this.element);
};