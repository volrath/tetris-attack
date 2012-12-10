require.config({
    paths: {
        // templates: '../templates',
        easel: 'libs/createjs/easeljs-0.5.0.min',
        preloadjs: 'libs/createjs/preloadjs-0.2.0.min',
        lodash: 'libs/lodash/lodash'
    },
    shim: {
        easel: {
            exports: 'createjs'
        },
        'preloadjs': {
            exports: 'createjs.PreloadJS'
        }
    }
});

require(['modules/game', 'easel'], function(game) {
    createjs.Ticker.addListener(game);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(36);
});
