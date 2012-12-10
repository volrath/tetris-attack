define(['easel'], function() {
    var stages = {
        blue: new createjs.Stage(document.getElementById('blue-player')),
        red:  new createjs.Stage(document.getElementById('red-player'))
    };

    var tick = function (msDuration) {
        //console.info(msDuration);

        for (var key in stages)
            stages[key].update();
    };

    return {
        tick: tick
    };
});
