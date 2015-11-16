/* Create new Audio instance **/
myAudio = new Audio('EpicMusic.ogg'); 
myAudio.addEventListener('ended', function() {
    //this.currentTime = 0;
    this.play();
}, false);
/* Play Sound **/
myAudio.play();
