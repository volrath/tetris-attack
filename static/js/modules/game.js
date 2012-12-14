define(['modules/helpers/loader', 'modules/helpers/events', 'modules/board', 'easel'], function(loader, events, Board) {
    var stages = {
        blue: new createjs.Stage(document.getElementById('blue-player')),
        red:  new createjs.Stage(document.getElementById('red-player'))
    };
    var boards = [];

    /*
     * Init: initializes event listening, preloads all assets and starts the
     * game. Then adds `tick` to listen to createjs Ticker's events.
     */
    var init = function (preload, callback) {
        createjs.Ticker.useRAF = true;
        createjs.Ticker.setFPS(36);

        events.init();

        loader.preload(
            preload,
            function () {
                if (callback) callback();
                start();
                createjs.Ticker.addListener(tick);
            }
        );
    };

    /*
     * Start: runs once before the game starts ticking, this is useful to
     * initialize game's objects.
     */
    var start = function () {
        boards.push(new Board(stages.blue));
        boards.push(new Board(stages.red));
    };

    /*
     * Tick: ticking function, will be called once 1/fps milliseconds.
     */
    var tick = function (msDuration) {
        //console.info(msDuration);

        // var evs = events.get();
        // if (evs.length)
        //     console.log(evs);

        for (var i in boards)
            boards[i].update(msDuration);
    };

    return {
        init: init
    };
});
