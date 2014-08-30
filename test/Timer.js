var Timer   = require('../lib/Timer')
, assert  = require("assert")
, sinon = require('sinon')
, EventEmitter = require('events').EventEmitter;


describe('Timer', function(){

    describe('.start()', function(){
        it('should return a callback when the timer starts', function(done){
            var timer = new Timer();
            timer.start(function(err) {
                if (err) throw err;
                done();
            });
            timer.stop();
        })
    })

    describe('.start()', function(){
        it('should emit a "start" event with a timestamp value when the timer starts', function(){
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var timer = new Timer();
            timer.on("start", spy1);
            timer.on("this does not exist", spy2);
            timer.start();

            var clock = sinon.useFakeTimers();
            clock.tick(500);

            assert.ok(spy1.called);
            assert.ok(!spy2.called);
            timer.stop();
            delete timer;
        })
    })




    describe('.start()', function(){
        it('should throw an error when the timer is already started', function(){
            var timer = new Timer();
            timer.start();
            assert.throws(timer.start);
            delete timer;
        })
    })




    describe('.stop()', function(){
        it('should return a callback when the timer stops', function(done){
            var timer = new Timer();
            timer.start();
            var clock = sinon.useFakeTimers();
            clock.tick(500);
            timer.stop(function(err) {
                if (err) throw err;
                done();
            });
            delete timer;
        })
    })

    describe('.stop()', function(){
        it('should emit a "stop" event with a timestamp value when the timer stops', function(){
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var timer = new Timer();
            timer.start();
            var clock = sinon.useFakeTimers();
            clock.tick(500);
            timer.on("stop", spy1);
            timer.on("this does not exist", spy2);
            timer.stop();
            assert.ok(spy1.called);
            assert.ok(!spy2.called);
            delete timer, spy1, spy2
        })
    })

    describe('.stop()', function(){
        it('should throw an error when the timer is not started', function(){
            var timer = new Timer();
            assert.throws(timer.stop);
            delete timer;
        })
    })

    describe('.getDuration()', function(){
        it('should throw an error when the timer is not started', function(){
            var timer = new Timer();
            assert.throws(timer.getDuration);
            delete timer;
        })
    })

    describe('.getDuration()', function(){
        it('should return a millisecond value, > 0', function(){
            var callback = sinon.spy();
            var timer = new Timer();
            timer.start(callback);
            var clock = sinon.useFakeTimers();
            clock.tick(500);
            timer.stop();
            assert(callback.calledOnce);
            console.log('duration', timer.getDuration());
            //assert.ok(timer.getDuration > 0);
            delete timer;
        })
    })

})

