function UIButton()
{
   this.element;
}

UIButton.prototype.initEmpty = function()
{
   this.element = null;

   return this;
};
UIButton.prototype.initWithSizePositionAndText = function(width, height, left, top, text, callback)
{
   this.initEmpty();

   this.element = document.createElement('div');
   this.element.classList.add('ui-button');
   this.element.style.top = top + 'px';
   this.element.style.left = left + 'px';
   this.element.style.width = width + 'px';
   this.element.style.height = height + 'px';

   this.element.appendChild(document.createTextNode(text));

   this.element.addEventListener('click', callback);

   return this;
};

// Getters

UIButton.prototype.getElement = function()
{
   return this.element;
};

// Methods

UIButton.prototype.destroy = function()
{
   this.element.parentElement.removeChild(this.element);
};