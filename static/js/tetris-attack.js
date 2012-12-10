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
    var preloadAssets = [
        '/static/images/blocks/green.png',
        '/static/images/blocks/blue.png',
        '/static/images/blocks/purple.png'
    ];
    game.init(preloadAssets, function () { console.log('loading done.'); });
});
