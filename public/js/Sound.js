myAudio = new Audio('EpicMusic.ogg'); 
myAudio.addEventListener('ended', function() {
    //this.currentTime = 0;
    this.play();
}, false);
myAudio.play();