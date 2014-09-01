/**
 * Created by ronan on 01/09/2014.
 */

var Player = require('player');
var SoundPlayer = function (duration) {
    this.player = new Player('sounds/4.mp3');
    this.playing = false;
    this.duration = duration || 10000; // default is 10s.
};

SoundPlayer.prototype.play = function () {
    console.log(this.duration);
    this.playing = true;
    var self = this;
    setTimeout(function (){
        this.playing = false;
    }, this.duration);
    this.player.play(function(err, player){
       console.log('ended playing');
    });
};

SoundPlayer.prototype.getDuration = function() {
    return this.duration;
};

SoundPlayer.prototype.setDuration = function(d) {
    this.duration = d;
};

 SoundPlayer.prototype.stop = function() {
     this.playing = false;
};


module.exports = SoundPlayer;
