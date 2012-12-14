define(['lodash', 'modules/block', 'modules/controller', 'modules/helpers/loader','modules/helpers/events', 'modules/globals', 'alea', 'easel'], function(_, Block,Controller, loader, events, globals) {
    var random = new Alea();

    var Board = function (stage) {
        this.stage = stage;

        this.initialRows = 7;
        this.maxRows     = 12;
        this.cols        = 6;
        this.matrix      = [];

        this.controller = new Controller();
        this.stage.addChild(this.controller);


        for (var i = 0; this.matrix.length < this.initialRows; i++)
            this.matrix.push(this.newRow(500 - i * globals.blockSize, i));
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

            row.push(block);
            this.stage.addChild(block);
        }
        return row;
    };

    Board.prototype.update = function (msDuration) {
        if (!this.stage.getNumChildren() || this.stage.getChildAt(this.stage.getNumChildren() - 1).y < 501)
            this.matrix.unshift(this.newRow());

        this.stage.update();
    };

    Board.prototype.handle = function(event){
        this.controller.handle(event);
    };
    return Board;
});
