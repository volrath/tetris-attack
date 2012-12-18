define(['lodash', 'modules/block','modules/swapper', 'modules/helpers/loader','modules/helpers/events', 'modules/globals', 'alea', 'easel', 'tween'], function(_, Block,Swapper, loader, events, globals) {
    var random = new Alea();

    var Board = function (stage) {
        this.stage = stage;

        this.rows        = 11;
        this.cols        = 6;
        this.matrix      = [];

        this.blockContainer = new createjs.Container();
        this.stage.addChild(this.blockContainer);

        for (var i = 0; i < this.rows; i++)
            if (i > 5)
                this.matrix.push(this.newRow(i * globals.blocks.size, i));
            else {
                var newRow = [];
                while (newRow.push(null) < this.cols);
                this.matrix.push(newRow);
            }

        this.swapper = new Swapper();
        this.blockContainer.addChild(this.swapper);

        this.nextRow = this.newRow();
        this.moveBlocks();

        var board = this;

        // we remove matched blocks from the random initialization
        // do {
        //     var matched = this.matchingBlocks();
        //     _.each(matched, function (blockList) {
        //         _.each(blockList, function (block) {
        //             board.blockContainer.removeChild(block);
        //             board.matrix[block.i][block.j] = null;
        //             delete block;
        //         });
        //     });
        //     this.blocksGravity(false);
        // } while (matched.length != 0);

        this.containerTween = new createjs.Tween(this.blockContainer, {override: true, loop: true});
        this.containerTween.to({x: this.blockContainer.x, y: this.blockContainer.y - globals.blocks.size}, globals.difficulty.easy.speed)
                           .call(function() {
                               board.moveBlocks();
                           });

        // debug...
        this.mG = new createjs.Container();
        this.stage.addChild(this.mG);
    };

    /*
     * Makes all the 'floating' blocks fall to their lower 'y' point.
     */
    Board.prototype.blocksGravity = function (duration) {
        var space, block;
        for (var j = 0; j < this.cols; j++)
            for (var i = this.rows - 1; i >= 0; i--) {
                space = this.matrix[i][j];
                if (space !== null) continue;  // current space is not empty, there's a block

                // now we search upwards for blocks to fall down.
                var d = 0;
                for (var k = i - 1; k >= 0; k--) {
                    block = this.matrix[k][j];
                    if (block !== null && block.state === globals.blocks.states.static) {
                        block.fallTo(this.matrix, i - d, duration);
                        d++;
                    }
                }
                break;
            }
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
                    if (block2 !== null && block2.isMatchable() && block.color === block2.color) matchCount++;
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
            console.log("you're losing");

        this.matrix.shift();
        this.matrix.push(this.nextRow);
        _.each(this.nextRow, function (block) { block.awake(); });
        this.nextRow = this.newRow();

        for (var i = 0; i < this.matrix.length; i++)
            for (var j = 0; j < this.matrix[i].length; j++)
                if (this.matrix[i][j] !== null) {
                    this.matrix[i][j].i--;
                    this.matrix[i][j].y -= globals.blocks.size;
                }
        this.blockContainer.y = 0;

        // Swapper position is updated
        this.swapper.y -= globals.blocks.size;
        this.blockContainer.setChildIndex(this.swapper,0);

        // debug..
        var matched = this.matchingBlocks();
        _.each(matched, function (blockList) {
            _.each(blockList, function (block) { block.matched = true; });
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
            block = new Block(j * globals.blocks.size, y, i, j, color);

            row.push(block);
            this.blockContainer.addChild(block);
        }
        return row;
    };

    Board.prototype.update = function (msDuration) {
        // debug
        this.mG.removeAllChildren();
        var rect, label;
        for (var i = 0; i < this.rows; i++)
            for(var j = 0; j < this.cols; j++) {
                if (this.matrix[i][j] === null) continue;
                rect = new createjs.Graphics();
                rect.setStrokeStyle(1);
                rect.beginStroke(createjs.Graphics.getRGB(255, 255, 255));
                rect.rect(j * globals.blocks.size, i * globals.blocks.size, globals.blocks.size, globals.blocks.size);
                this.mG.addChild(new createjs.Shape(rect));
                label = new createjs.Text('(' + i + ', ' + j + ', ' + this.matrix[i][j].color + ')', '10px Arial', 'white');
                label.x = j * globals.blocks.size + 8;
                label.y = i * globals.blocks.size + 18;
                this.mG.addChild(label);
            }

        this.stage.update();
    };

    Board.prototype.handle = function(event){
        this.swapper.handle(event);
        if (event.key == events.K_SPACE){
            var objectPoint = this.stage.getObjectsUnderPoint(this.swapper.x+25,this.swapper.y+25);
            var leftBlock = objectPoint.length > 0 ? objectPoint[0] : false;
        }

        if (event.key === events.K_ENTER) {
            var board = this;
            var matched = this.matchingBlocks();
            _.each(matched, function (blockList) {
                _.each(blockList, function (block) {
                    board.blockContainer.removeChild(block);
                    board.matrix[block.i][block.j] = null;
                    delete block;
                });
            });
            this.blocksGravity(1000);
        }
    };
    return Board;
});
