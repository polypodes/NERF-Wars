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
var _ = require("underscore");

var startTime = undefined;
var endTime = undefined;
var duration = undefined;
var running = false;
var seconds = 0;
var topics = {};
var subUid = -1;
var eventList = [];

var Timer = function(){
    EventEmitter.call(this);
};

util.inherits(Timer, EventEmitter);

Timer.prototype.measureSecond = function() {
    var self = this;
    setTimeout(function (){
        if(running){
            seconds++;
            // get all events for current time-stamp:
            var e = _.where(eventList, {time: seconds});
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
    var mins = Math.floor(seconds/60);
    var secs = seconds % 60;
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
    this.reset();
    if(running) {
        this.stop();
        throw new Error("Cannot restart timer: stop it before please.");
    }
    startTime = new Date().getTime();
    this.emit("start", startTime);
    running = true;
    this.measureSecond();
    if (callback && typeof(callback) === "function") {
        callback();
    }
};

Timer.prototype.stop = function(callback){
    if(!this.isRunning()) {
        throw new Error("Cannot stop a timer that hasn't started yet.");
    }
    endTime = new Date().getTime();
    this.emit("stop", endTime);
    duration = endTime - startTime;
    this.reset();
    if (callback && typeof(callback) === "function") {
        callback();
    }
};

Timer.prototype.reset = function (callback) {
    seconds = 0;
    running = false;
    startTime = undefined;
    endTime = undefined;
    subUid = -1;
    //topics = {};
    //eventList = [];
    //delete startTime, endTime;
    //duration = undefined;

    if (callback && typeof(callback) === "function") {
        callback();
    }
};

Timer.prototype.isRunning = function () {
    return running;
};


//
//	Add / remove events:
//
Timer.prototype.addEvent = function (identifier, time){
    var event = {
        identifier: identifier,
        time: time
    };
    eventList.push(event);
};

Timer.prototype.removeEvent = function (identifier) {
    eventList = _(eventList).reject(function(el) {
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
    if( !topics[topic] ){
        return false;
    };
    var subscribers = topics[topic],
        len = subscribers ? subscribers.length : 0;
    while (len--) {
        subscribers[len].func(topic, args);
    };
    return this;
};

Timer.prototype.subscribe = function(topic, func){
    if (!topics[topic]) {
        topics[topic] = [];
    };
    var token = (++subUid).toString();
    topics[topic].push({
        token: token,
        func: func
    });
    return token;
};

Timer.prototype.unsubscribe = function(token) {
    for (var m in topics) {
        if (topics[m]) {
            for(var i = 0, j = topics[m].length; i<j ; i++) {
                if (topics[m][i].token === token){
                    topics[m].splice(i,1);
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
    return duration;
};

Timer.prototype.getEventList = function(){
    return eventList;
};

module.exports = Timer;


