/*

Usage:

    var timer = new Timer();
    timer.addEvent("event_a", 1);
    timer.addEvent("event_b", 4);
    timer.addEvent("event_c", 5);

    timer.removeEvent("event_b");

    var subscription = timer.subscribe('timedEvent', function(e, identifier){
        console.log(identifier); // will output "event_a" after 1 second and "event_c" after 5 seconds
    });

    var subscriptionIndividual = timer.subscribe('event_a', function(e){
        console.log("event_a");
 });

 */


var util         = require("util");
var EventEmitter = require("events").EventEmitter;

var startTime,
    endTime,
    duration,
    running = false,
    seconds = 0,
    topics = {},
    subUid = -1,
    eventList = [];


var Timer = function(){
    EventEmitter.call(this);
    this.measureSecond();
};

util.inherits(Timer, EventEmitter);

Timer.prototype.measureSecond = function() {
    var self = this;
    setTimeout(function (){
        if(this.running){
            this.seconds++;
            // get all events for current time-stamp:
            var e = _.where(this.eventList, {time: this.seconds});
            // for all events, publish 'timedEvent':
            _.each(e, function(event, key, e){
                self.publish('timedEvent', event.identifier);
                self.publish(event.identifier);
            });
        }
        self.measureSecond();
    }, 1000);
};

Timer.prototype.getFormatedTime = function() {
    var mins = Math.floor(this.seconds/60);
    var secs = this.seconds % 60;
    if(mins < 10){
        mins = "0" + mins;
    }
    if(secs < 10){
        secs = "0" + secs;
    }
    return mins + ":" + secs;
};

//
//	Controlling the time measuring:
//
Timer.prototype.start = function(callback){
    if(this.isRunning()) {
        throw new Error("Cannot restart timer: stop it before please.");
    }
    this.startTime = new Date().getTime();
    this.emit("start", this.startTime);
    this.running = true;
    if (callback && typeof(callback) === "function") {
        callback();
    }
};

Timer.prototype.stop = function(callback){
    if(!this.isRunning()) {
        throw new Error("Cannot stop a timer that hasn't started yet.");
    }
    this.endTime = new Date().getTime();
    this.emit("stop", this.endTime);
    this.duration = this.endTime - this.startTime;
    this.reset();
    if (callback && typeof(callback) === "function") {
        callback();
    }
};

Timer.prototype.reset = function (callback) {
    this.running = false;
    this.seconds = 0;
    this.running = false;
    delete this.startTime, this.endTime, this.duration;
    if (callback && typeof(callback) === "function") {
        callback();
    }
};

Timer.prototype.isRunning = function () {
    return this.running;
};


//
//	Add / remove events:
//
Timer.prototype.addEvent = function (identifier, time){
    var event = {
        identifier: identifier,
        time: time
    };
    this.eventList.push(event);
};

Timer.prototype.removeEvent = function (identifier) {
    this.eventList = _(this.eventList).reject(function(el) {
        return el.identifier === identifier;
    });
};


//
//	Publish/Subscribe implementation
// 	Note:
//		This part is based on Addy Osmani's Publish/Subscribe implementation
//		available at: http://addyosmani.com/resources/essentialjsdesignpatterns/book/
//		License: Creative Commons Attribution-Noncommercial-No Derivative Works 3.0 )
//
Timer.prototype.publish = function(topic, args){
    if( !this.topics[topic] ){
        return false;
    };
    var subscribers = this.topics[topic],
        len = subscribers ? subscribers.length : 0;
    while (len--) {
        subscribers[len].func(topic, args);
    };
    return this;
};

Timer.prototype.subscribe = function(topic, func){
    if (!this.topics[topic]) {
        this.topics[topic] = [];
    };
    var token = (++this.subUid).toString();
    this.topics[topic].push({
        token: token,
        func: func
    });
    return token;
};

Timer.prototype.unsubscribe = function(token) {
    for (var m in this.topics) {
        if (this.topics[m]) {
            for(var i = 0, j = this.topics[m].length; i<j ; i++) {
                if (this.topics[m][i].token === token){
                    this.topics[m].splice(i,1);
                    return token;
                };
            };
        };
    }
    return this;
};

Timer.prototype.getDuration = function(){
    if (this.isRunning()) {
        throw new Error("Cannot calculate a duration: check that start & end times exist.");
    }
    return this.duration;
};

module.exports = Timer;


