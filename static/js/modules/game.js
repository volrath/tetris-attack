define(['modules/helpers/loader', 'easel'], function(loader) {
    var stages = {
        blue: new createjs.Stage(document.getElementById('blue-player')),
        red:  new createjs.Stage(document.getElementById('red-player'))
    };

    var init = function (preload, callback) {
        createjs.Ticker.useRAF = true;
        createjs.Ticker.setFPS(36);

        //events.init();

        loader.preload(
            preload,
            function () {
                if (callback) callback();
                createjs.Ticker.addListener(tick);
            }
        );
    };

    var tick = function (msDuration) {
        //console.info(msDuration);

        for (var key in stages)
            stages[key].update();
    };

    return {
        init: init
    };
});
