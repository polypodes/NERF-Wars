/**
 * Created by ronan on 01/09/2014.
 */

var sound = '/Users/ronan/Workspace/Apps/NERF-Wars/sounds/4.mp3';
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');

var SoundPlayer = function (duration) {
    this.playing = true;
};

SoundPlayer.prototype.play = function () {
    this.playFile(sound);
    var self = this;
    setInterval(function () {
        if(self.playing) {
            self.playFile(sound);
        }
    },6700); // see `ffmpeg -i sounds/4.mp3`, then adjust
};

SoundPlayer.prototype.playFile = function (file) {
    fs.createReadStream(file)
        .pipe(new lame.Decoder())
        .on('format', function (format) {
            this.pipe(new Speaker(format));
        });
};

module.exports = SoundPlayer;
