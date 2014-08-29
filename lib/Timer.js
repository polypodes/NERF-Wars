var util         = require("util");
var EventEmitter = require("events").EventEmitter;

var Timer = function() {
    EventEmitter.call(this);
    var startTime,
        endTime,
        duration;
};

util.inherits(Timer, EventEmitter);

Timer.prototype.getDuration = function(){
    if(this.startTime === 'undefined' || this.endTime === 'undefined') {
        throw new Error("Cannot calculate a duration: check that start & end times exist.");
    }

    return this.duration;
};

Timer.prototype.start = function(callback) {
    if( typeof this.startTime !== 'undefined' ) {
        throw new Error("Cannot restart timer: stop it before please.");
    }
    this.startTime = new Date().getTime();

    this.emit("start", this.startTime);

    if (callback && typeof(callback) === "function") {
        callback();
    }
};

Timer.prototype.stop = function(callback) {
    if( typeof this.startTime === 'undefined' ) {
        throw new Error("Cannot stop a timer that hasn't started yet.");
    };

    this.endTime = new Date().getTime();
    this.duration = this.startTime = this.endTime;
    this.reset();

    this.emit("stop", this.endTime);

    if (callback && typeof(callback) === "function") {
        callback();
    }
};

Timer.prototype.reset = function() {
    delete startTime;
    delete stopTime;
};

module.exports = Timer;
