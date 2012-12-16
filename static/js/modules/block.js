define(['modules/helpers/loader', 'modules/globals', 'easel'], function(loader, globals) {
    var Block = function (x, y, i, j, color) {
        this.x = x;
        this.y = y;
        this.i = i;
        this.j = j;
        this.color = color;
        this.matched = false;

        this.initialize(loader.get(globals.assets.blocks[color]));
    };
    Block.prototype = new createjs.Bitmap();

    Block.prototype.p_draw = Block.prototype.draw;
    Block.prototype.draw = function (ctx, ignoreCache) {
        var p_draw = this.p_draw(ctx, ignoreCache);
        if (p_draw && this.matched) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(50, 50);
            ctx.stroke();
            ctx.fillText('(' + this.i + ', ' + this.j + ')', 10, 10);
        }
        return p_draw;
    };

    Block.prototype.isMatchable = function () {
        return true;
    };

    Block.prototype.onTick = function (msDuration) {
        this.alpha = this.y <= 500 ? 1 : 0.3;
    };

    return Block;
});