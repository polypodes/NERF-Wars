var Timer   = require('../lib/Timer')
, assert  = require("assert")
, sinon = require('sinon')
, EventEmitter = require('events').EventEmitter;


describe('Timer', function(){

    var clock;
    beforeEach(function () {
        clock = sinon.useFakeTimers();
    });

    afterEach(function () {
        clock.restore();
    });

    describe("sinon's fakeTimer's clock", function() {
        it("should time out inside a test a after n ms", function() {
            var timedOut = false;
            setTimeout(function () {
                timedOut = true;
            }, 500);
            clock.tick(499);
            assert.ok(!timedOut);
            clock.tick(500);
            assert.ok(timedOut);
        });
    });

    describe("Mocha's done()", function(){
        it('should set a test as OK', function(done) {
            var timer = new Timer();
            timer.start();
            setTimeout(function () {
                timer.stop();
                delete timer;
                done();
            }, 500);
            clock.tick(500);
        });
    });

    describe('.start()', function(){
        it('should run a callback', function(done){
            var timer = new Timer();
            timer.start(function(err) {
                if (err) throw err;
                done();
            });
            timer.stop();
            delete timer;
        });
    });

    describe('.reset()', function(){
        it('should run a callback', function(done){
            var timer = new Timer();
            timer.reset(function(err) {
                if (err) throw err;
                delete timer;
                done();
            });
        });
    });


    describe('.start()', function(){
        it('should emit a "start" event with a timestamp value when the timer starts', function(){
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var timer = new Timer();
            timer.on("start", spy1);
            timer.on("this does not exist", spy2);
            timer.start();
            assert.ok(spy1.called && !spy2.called);
            timer.stop();
            delete timer;
        });
    });

    describe('.start()', function(){
        it('should throw an error when the timer is already started', function(){
            var timer = new Timer();
            timer.start();
            assert.throws(timer.start(), Error);
            delete timer;
        });
    });

     describe('.stop()', function(){
        it('should run a callback', function(done){
            var timer = new Timer();
            timer.start();
            timer.stop(function(err) {
                if (err) throw err;
                done();
            });
            delete timer;
        });
    });

    describe('.stop()', function(){
        it('should emit a "stop" event when the timer stops', function(){
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var timer = new Timer();
            timer.start();
            timer.on("stop", spy1);
            timer.on("this does not exist", spy2);
            timer.stop();
            assert.ok(spy1.called && !spy2.called);
            delete timer, spy1, spy2
        });
    });

    describe('.stop()', function(){
        it('should throw an error when the timer is not started', function(){
            var timer = new Timer();
            assert.throws(timer.stop);
            delete timer;
        });
    });

    describe('.getDuration()', function(){
        it('should throw an error when the timer is not started', function(){
            var timer = new Timer();
            assert.throws(timer.getDuration);
            delete timer;
        });
    });

    describe('.getFormatedTime()', function(){
        it('should return a non-empty string', function(){
            var callback = sinon.spy();
            var timer = new Timer();
            timer.on("stop", callback);
            timer.start();
            var timedOut = false;
            setTimeout(function () {
                timedOut = true;
            }, 500);
            clock.tick(510);
            var ellapsed = timer.getFormatedTime();
            timer.stop();
            var duration = timer.getDuration();
            assert.ok(ellapsed.length > 0);
            delete timer;
        })
    })

    describe('.getDuration()', function(){
        it('should return a millisecond value, > 0', function(){
            var callback = sinon.spy();
            var timer = new Timer();
            timer.on("stop", callback);
            timer.start();
            var timedOut = false;
            setTimeout(function () {
                timedOut = true;
            }, 500);
            clock.tick(510);
            timer.stop();
            assert.ok(timedOut && callback.calledOnce && timer.getDuration() > 0);
            delete timer;
        })
    });

    describe('.getEventList()', function(){
        it('should return an event list', function(){
            var eventCount = Math.floor((Math.random() * 10) + 1); // between 1 and 10 events
            var timer = new Timer();
            for(var i=0; i< eventCount; i++) {
                var eventTime = Math.floor((Math.random() * 10) + 1); // between 1 and 10 seconds
                timer.addEvent('testEvent #'+i, eventTime);
            }
            assert.ok(timer.getEventList().length > 0 && 11 > timer.getEventList().length);
            timer.start();
            timer.stop();
            delete timer;
        })
    })

     describe('.removeEvent(s)', function() {
        it('should remove an identified event', function() {
            var timer = new Timer();
            timer.addEvent('testEventA', 1);
            timer.addEvent('testEventB', 2);
            timer.removeEvent('testEventA');
            assert.ok(timer.getEventList().pop().identifier === 'testEventB');
            delete timer;

        });
    });

    describe('.addEvent(s)', function() {
        it('should rise an event after s seconds', function(done) {
            var timer = new Timer();
            var callback = sinon.spy();
            var eventRaised = false;
            timer.addEvent('testEvent', 1);
            var subscriptionToTestEvent = timer.subscribe('testEvent', function(e){
                callback();
                timer.stop();
                delete timer;
                done();
            });
            timer.start();
            var timedOut = false;
            setTimeout(function () {
                timedOut = true;
            }, 1000);
            clock.tick(999);
            assert.ok(!callback.calledOnce && !timedOut);
            clock.tick(1000);
            assert.ok(callback.calledOnce && timedOut);
        });
    });
})
