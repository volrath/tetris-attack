define(['lodash', 'preloadjs'], function(_) {
    var assets = {},
        preloadQueue;

    var get = function (key) {
        if (typeof key !== 'string') return;
        var img = assets[key];
        if (!img)
            throw new Error('Missing "' + key + '", loader.preload() all images before trying to load them.');
        return _.clone(img);
    };

    var preload = function (manifest, callback) {
        reload(manifest, callback);
        loadAll(manifest);
    };

    var reload = function (manifest, callback) {
        if (preloadQueue != null)
            preloadQueue.close();

        var manifestLength = manifest.length;

        preloadQueue = new createjs.PreloadJS();
        preloadQueue.onProgress = handlers.overallProgress;
        preloadQueue.onFileProgress = handlers.fileProgress;
        preloadQueue.onError = handlers.fileError;
        preloadQueue.setMaxConnections(5);

        preloadQueue.onFileLoad = function (event) {
            handlers.fileLoad(event);
            if (_.keys(assets).length == manifestLength && preloadQueue.progress == 1)
                callback();
        };
    };

    var loadAll = function (manifest) {
        var item;
        while (manifest.length > 0) {
            item = manifest.shift();
            preloadQueue.loadFile(item);
        }
    };

    var handlers = {
        fileLoad: function (event) {
            assets[event.id] = event.result;
            console.log(event);
        },

        overallProgress: function (event) {
            console.log('TOTAL: ' + preloadQueue.progress);
        },

        fileProgress: function (event) {},

        fileError: function (event) {
            console.log('ERROR:', event);
        }
    };

    return {
        get: get,
        preload: preload
    };
});
