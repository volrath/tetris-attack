define(['preloadjs'], function() {
    var assets = [],
        preloadQueue;

    var preload = function (manifest, callback) {
        reload(manifest, callback);
        loadAll(manifest);
    };

    var reload = function (manifest, callback) {
        if (preloadQueue != null)
            preloadQueue.close();

        var manifestLength = manifest.length;

        // Create a preloader. There is no manfest added to it up-front, we will add items on-demand.
        preloadQueue = new createjs.PreloadJS();
        preloadQueue.onProgress = handlers.overallProgress;
        preloadQueue.onFileProgress = handlers.fileProgress;
        preloadQueue.onError = handlers.fileError;
        preloadQueue.setMaxConnections(5);

        preloadQueue.onFileLoad = function (event) {
            handlers.fileLoad(event);
            if (assets.length == manifestLength && preloadQueue.progress == 1) {
                callback();
            }
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
            assets.push(event.result);
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
        preload: preload
    };
});
