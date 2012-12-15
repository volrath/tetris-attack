require.config({
    paths: {
        // templates: '../templates',
        alea: 'libs/Alea',
        easel: 'libs/createjs/easeljs-0.5.0.min',
        preloadjs: 'libs/createjs/preloadjs-0.2.0.min',
        tween: 'libs/createjs/tweenjs-0.3.0.min',
        lodash: 'libs/lodash/lodash'
    },
    shim: {
        alea: {
            exports: 'Alea'
        },
        easel: {
            exports: 'createjs'
        },
        preloadjs: {
            exports: 'createjs.PreloadJS'
        },
        tween: {
            exports: 'createjs.Tween'
        }
    }
});

require(['modules/game', 'modules/globals'], function(game, globals) {
    var preloadAssets = globals.assets.blocks.slice(0);
    preloadAssets.push('/static/images/handler.png');
    game.init(preloadAssets, function () { console.log('loading done.'); });
});
