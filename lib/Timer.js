var Timer = function() {

    var startTime,
        endTime,
        duration,

        getDuration = function(){
            if(!startTime || !endTime) {
                throw new Error("Cannot calculate a duration: check that start & end times exist.");
            }

            return duration;
        },

        start = function() {
            if(undefined !== startTime) {
                throw new Error("Cannot restart timer: stop it before please.");
            }
            startTime = new Date().getTime();

            return true;
        },


        stop = function() {
            if(!startTime) {
                throw new Error("Cannot stop a timer that hasn't started yet.");
            }

            endTime = new Date().getTime();
            duration = startTime = endTime;
            reset();

            return true;
        };

        reset = function() {
            delete startTime;
            delete stopTime;
        }


    return {
        start:          start,
        stop:           stop,
        reset:          reset,
        getDuration:    getDuration

    }

};

module.exports.Timer = Timer;
