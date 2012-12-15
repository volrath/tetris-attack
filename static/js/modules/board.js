define(['lodash', 'modules/block','modules/swapper', 'modules/helpers/loader','modules/helpers/events', 'modules/globals', 'alea', 'easel'], function(_, Block,Swapper, loader, events, globals) {
    var random = new Alea();

    var Board = function (stage) {
        this.stage = stage;

        this.initialRows = 7;
        this.maxRows     = 12;
        this.cols        = 6;
        this.matrix      = [];
        this.swapper = new Swapper();

        this.stage.addChild(this.swapper);
        var innerShadow = new createjs.Graphics();
        innerShadow.beginLinearGradientFill(["transparent", "#000"], [0, 1], 0, 0, 0, 78).drawRect(0, 0, 300, 80);

        var innerShadowShape = new createjs.Shape(innerShadow);
        innerShadowShape.x = 0;
        innerShadowShape.y = 470;

        this.stage.addChild(innerShadowShape);

        for (var i = 0; this.matrix.length < this.initialRows; i++)
            this.matrix.push(this.newRow(500 - i * globals.blockSize, i));

        console.log(this.matrix);
    };

    Board.prototype.newRow = function (y, i) {
        y = y || 550;
        i = i || 0;
        var row = [],
            color,
            block;

        for (var j = 0; j < this.cols; j++) {
            color = Math.floor(random() * 5);  // from 0 to 4
            block = new Block(j * globals.blockSize, y, i, j, color);
            // block = new createjs.Bitmap(loader.get(globals.assets.blocks[color]));
            // block.color = color;
            // block.x = j * globals.blockSize;
            // block.y = y;

            row.push(block);
            this.stage.addChildAt(block, 0);
        }
        return row;
    };

    Board.prototype.update = function (msDuration) {
        if (!this.stage.getNumChildren() || this.stage.getChildAt(0).y < 501)
            this.matrix.unshift(this.newRow());

        this.stage.update();
    };

    Board.prototype.handle = function(event){
        this.swapper.handle(event);
        if (event.key == events.K_SPACE){
            var objectPoint = this.stage.getObjectsUnderPoint(this.swapper.x+25,this.swapper.y+25);
            var leftBlock = objectPoint.length > 0 ? objectPoint[0] : false;

        }

    };
    return Board;
});
