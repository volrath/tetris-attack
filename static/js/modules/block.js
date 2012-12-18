define(['modules/helpers/loader', 'modules/globals', 'easel', 'tween'], function(loader, globals) {
    var Block = function (x, y, i, j, color) {
        this.x = x;
        this.y = y;
        this.i = i;
        this.j = j;
        this.color = color;
        this.state = y > 500 ? globals.blocks.states.awaking : globals.blocks.states.static;  // 500 should not be a magic number, it's numRows-1 * block's size
        this.matched = false;

        this.initialize(loader.get(globals.assets.blocks[color]));
    };
    Block.prototype = new createjs.Bitmap();

    Block.prototype.awake = function () {
        this.state = globals.blocks.states.static;
        this.alpha = 1;
        return true;
    };

    Block.prototype.p_draw = Block.prototype.draw;
    Block.prototype.draw = function (ctx, ignoreCache) {
        var p_draw = this.p_draw(ctx, ignoreCache);
        if (p_draw && this.matched) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(50, 50);
            ctx.stroke();
        }
        return p_draw;
    };

    Block.prototype.fallTo = function (matrix, newI, duration) {
        var block = this,
            position = {
                x: this.x,
                y: newI * globals.blocks.size
            };
        this.state = globals.blocks.states.falling;
        matrix[this.i][this.j] = null;
        matrix[newI][this.j]   = block;
        if (!duration) {
            block.state = globals.blocks.states.static;
            block.i = newI;
            block.y = newI * globals.blocks.size;
        } else
            createjs.Tween.get(this)
                          .to(position, duration)
                          .call(function () {
                              block.state = globals.blocks.states.static;
                              block.i = newI;
                          });
    };

    Block.prototype.isMatchable = function () {
        return true;
    };

    Block.prototype.onTick = function (msDuration) {  // this right now is useless, it's here as a proof of concept
        this.alpha = this.state === globals.blocks.states.awaking ? 0.3 : 1;
    };

    return Block;
});
