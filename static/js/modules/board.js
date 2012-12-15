define(['lodash', 'modules/block', 'modules/controller', 'modules/helpers/loader','modules/helpers/events', 'modules/globals', 'alea', 'easel', 'tween'], function(_, Block,Controller, loader, events, globals) {
    var random = new Alea();

    var Board = function (stage) {
        this.stage = stage;

        this.rows        = 11;
        this.cols        = 6;
        this.matrix      = [];

        this.blockContainer     = new createjs.Container();
        this.stage.addChild(this.blockContainer);

        this.controller = new Controller();
        this.stage.addChild(this.controller);

        for (var i = 0; i < this.rows; i++)
            if (i > 5)
                this.matrix.push(this.newRow(i * globals.blockSize, i));
            else {
                var newRow = [];
                while (newRow.push(null) < this.cols);
                this.matrix.push(newRow);
            }

        // debug...
        var mG = new createjs.Graphics();
        mG.setStrokeStyle(1);
        mG.beginStroke(createjs.Graphics.getRGB(255, 0, 0));
        for (i = 0; i < this.rows; i++) {
            mG.moveTo(0, i * 50);
            mG.lineTo(this.cols * 50, i * 50);
            for (var j = 0; j < this.cols; j++) {
                mG.moveTo(j * 50, 0);
                mG.lineTo(j * 50, this.rows * 50);
            }
        }
        this.stage.addChild(new createjs.Shape(mG));

        this.nextRow = this.newRow();
        this.moveBlocks();
    };

    /*
     * Returns a list of list where every list represents matched blocks in a
     * row or column in the board's matrix. Example:
     *
     * [
     *     [b01, b02, b03],       // first match:  3 blocks
     *     [b10, b11, b12, b13],  // second match: 4 blocks
     *     [b21, b22, b23]        // third match:  3 blocks
     * ]
     */
    Board.prototype.matchingBlocks = function () {
        var block, block2, matchedList = [], matchedSeq, matchCount;
        for (var i = 0; i < this.matrix.length; i++) {
            for(var j = 0; j < this.matrix[i].length; j++) {
                block = this.matrix[i][j];
                if (block === null || !block.isMatchable()) continue;

                // horizontal matching
                matchCount = 0;
                for (var k = j+1; k < this.matrix[i].length; k++) {
                    block2 = this.matrix[i][k];
                    if (block2.isMatchable() && block.color === block2.color) matchCount++;
                    else break;
                }
                if (matchCount >= 2) {
                    matchedSeq = [];
                    for (k = 0; k <= matchCount; k++)
                        matchedSeq.push(this.matrix[i][j+k]);
                    matchedList.push(matchedSeq);
                }

                // vertical matching
                matchCount = 0;
                for (k = i+1; k < this.matrix.length; k++) {
                    block2 = this.matrix[k][j];
                    if (block2 !== null && block2.isMatchable() && block.color == block2.color) matchCount++;
                    else break;
                }
                if (matchCount >= 2) {
                    matchedSeq = [];
                    for (k = 0; k <= matchCount; k++)
                        matchedSeq.push(this.matrix[i+k][j]);
                    matchedList.push(matchedSeq);
                }
            }
        }
        return matchedList;
    };

    Board.prototype.moveBlocks = function () {
        var board = this;
        if (_.some(this.matrix[0]))
            console.log('youre losing');

        this.matrix.shift();
        this.matrix.push(this.nextRow);
        this.blockContainerSize += globals.blockSize;
        this.nextRow = this.newRow();

        for (var i = 0; i < this.matrix.length; i++)
            for (var j = 0; j < this.matrix[i].length; j++)
                if (this.matrix[i][j] !== null) {
                    this.matrix[i][j].i--;
                    this.matrix[i][j].y -= globals.blockSize;
                }
        this.blockContainer.y = 0;

        // debug..
        var matched = this.matchingBlocks();
        _.each(matched, function (blockList) {
            _.each(blockList, function (block) { block.matched = true; });
        });

        createjs.Tween.get(this.blockContainer, {override: true})
                      .to({x: this.blockContainer.x, y: this.blockContainer.y - globals.blockSize}, 7000)
                      .call(function() {
                          board.moveBlocks();
                      });
    };

    Board.prototype.newRow = function (y, i) {
        y = y || 550;
        i = i || this.rows;
        var row = [],
            color,
            block;

        for (var j = 0; j < this.cols; j++) {
            color = Math.floor(random() * 5);  // from 0 to 4
            block = new Block(j * globals.blockSize, y, i, j, color);

            row.push(block);
            this.blockContainer.addChild(block);
        }
        return row;
    };

    Board.prototype.update = function (msDuration) {
        this.stage.update();
    };

    Board.prototype.handle = function(event){
        this.controller.handle(event);
    };
    return Board;
});
