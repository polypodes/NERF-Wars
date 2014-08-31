/**
 * Created by ronan on 31/08/2014.
 */

var Timer = require('./lib/Timer');
var timer = new Timer();

timer.addEvent("event_a", 1);
timer.addEvent("event_b", 2);
timer.addEvent("event_c", 3);
timer.addEvent("event_d", 4);
timer.start();


console.log('Expecting ' + timer.getEventList().length + ' events to come')


timer.removeEvent("event_b");
var subscription = timer.subscribe('timedEvent', function(e, identifier){
    console.log('automatic all-events subscription found',identifier); // will output "event_a" after 1 second and "event_c" after 5 seconds
});
var subscriptionIndividual = timer.subscribe('event_a', function(e){
    console.log('individual subscription found', e);
});

setTimeout(function () {
    timer.stop();
    console.log('timer duration:', timer.getDuration());
    console.log('CTRL+C to quit.');
}, 5001);

