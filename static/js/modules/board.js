define(['modules/helpers/loader', 'modules/globals', 'alea', 'easel'], function(loader, globals) {
    var random = new Alea();

    var Board = function (stage) {
        this.stage = stage;

        this.initialRows = 7;
        this.maxRows     = 12;
        this.cols        = 6;
        this.matrix      = [];

        var innerShadow = new createjs.Graphics();
        innerShadow.beginLinearGradientFill(["transparent","#000"], [0, 1], 0, 0, 0, 78).drawRect(0, 0, 300, 80);

        var innerShadowShape = new createjs.Shape(innerShadow);
        innerShadowShape.x = 0;
        innerShadowShape.y = 470;

        this.stage.addChild(innerShadowShape);

        for (var i = 0; this.matrix.length < this.initialRows; i++)
            this.matrix.push(this.newRow(500 - i * globals.blockSize));
    };

    Board.prototype.newRow = function (y) {
        y = y || 550;
        var row = [],
            color,
            block;

        for (var j = 0; j < this.cols; j++) {
            color = Math.floor(random() * 5);  // from 1 to 5

            block = new createjs.Bitmap(loader.get(globals.assets.blocks[color]));
            block.color = color;
            block.x = j * globals.blockSize;
            block.y = y;

            row.push(block);
            this.stage.addChildAt(block, 0);
        }
        console.log(row);
        return row;
    };

    Board.prototype.switch = function (cursor) {

    };

    Board.prototype.update = function (msDuration) {

    };

    return Board;
});
