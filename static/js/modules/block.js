define(['modules/helpers/loader', 'modules/globals', 'easel'], function(loader, globals) {
    var Block = function (x, y, i, j, color) {
        this.x = x;
        this.y = y;
        this.i = i;
        this.j = j;
        this.color = color;

        this.initialize(loader.get(globals.assets.blocks[color]));
    };

    Block.prototype = new createjs.Bitmap();

    Block.prototype.onTick = function (msDuration) {
        this.y -= globals.difficulty['easy'].speed;
    };

    return Block;
});