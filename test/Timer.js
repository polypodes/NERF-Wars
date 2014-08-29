var Timer   = require('../lib/Timer');
var assert  = require("assert");

describe('Timer', function(){

    describe('.start()', function(){
        it('should return true when the timer starts', function(){
            var timer = new Timer();
            assert.ok(timer.start());
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
        it('should return true when the timer is started', function(){
            var timer = new Timer();
            timer.start();
            assert.ok(timer.stop());
            delete timer;
        })
    })

    describe('.stop()', function(){
        it('should throw an error when the timer is not started', function(){
            var timer = new Timer();
            assert.throws(timer.stop);
            delete timer;
        })
    })

})

