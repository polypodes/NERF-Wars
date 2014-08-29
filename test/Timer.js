var Timer   = require('../lib/Timer').Timer;
var assert  = require("assert");

describe('Timer', function(){

    describe('#start()', function(){
        it('should return true when the timer starts', function(){
            var timer = new Timer();
            console.log(timer);
            assert.ok(timer.start());
            timer.stop();
            delete timer;
        })
    })

    describe('#start()', function(){
        it('should throw an error when the timer is not already started', function(){
            var timer1 = new Timer();
            var timer2 = new Timer();
            assert.throws(timer2.start());
            delete timer1;
            delete timer2;
        })
    })
})

