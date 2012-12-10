require.config({
    paths: {
        // templates: '../templates',
        easel: 'libs/createjs/easeljs-0.5.0.min',
        lodash: 'libs/lodash/lodash'
    },
    shim: {
        easel: {
            exports: 'createjs'
        }
    }
});

require(['modules/game', 'easel'], function(game) {
    createjs.Ticker.addListener(game);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(36);
});
