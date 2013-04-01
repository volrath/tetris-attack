define(['lodash', 'modules/block','modules/swapper', 'modules/helpers/loader','modules/helpers/events', 'modules/globals', 'alea', 'easel', 'tween'], function(_, Block, Swapper, loader, events, globals) {
    var random = new Alea();

    var Board = function (stage) {
        this.stage = stage;

        this.rows        = 11;
        this.cols        = 6;
        this.matrix      = [];
        this.ceil        = 0;
        this.speed       = globals.difficulty.hard.speed;

        this.blockContainer = new createjs.Container();
        this.stage.addChild(this.blockContainer);

        for (var i = 0; i < this.rows; i++)
            if (i > 5) {
                this.matrix.push(this.newRow(i, i * globals.blocks.size, true));
            } else {
                var newRow = [];
                while (newRow.push(null) < this.cols);
                this.matrix.push(newRow);
            }

        this.swapper = new Swapper(this);
        this.blockContainer.addChild(this.swapper);

        this.nextRow = this.newRow();

        // we start the blockContainer animation
        var board = this;
        createjs.Tween.get(this.blockContainer).to({x: this.blockContainer.x, y: -globals.blocks.size}, this.speed)
            .call(function (tween) { board.moveBlocks(); });

        // debug...
        this.mG = new createjs.Container();
        this.stage.addChild(this.mG);
        // console.log('-------------------');
        // console.log(this.ceil, this.rows, this.matrix.length);
        // _.each(this.matrix, function (row) {
        //     console.log(
        //         row[0] === null ? 'b' : row[0].color,
        //         row[1] === null ? 'b' : row[1].color,
        //         row[2] === null ? 'b' : row[2].color,
        //         row[3] === null ? 'b' : row[3].color,
        //         row[4] === null ? 'b' : row[4].color,
        //         row[5] === null ? 'b' : row[5].color
        //     );
        // });
    };

    /*
     * Makes all the 'floating' blocks fall to their lower 'y' point.
     */
    Board.prototype.blocksGravity = function (duration) {
        var space, block;
        for (var j = 0; j < this.cols; j++)
            for (var i = this.rows - 1; i >= this.ceil; i--) {
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
     * Makes all the 'floating' blocks fall to their lower 'y' point in a specified column.
     */
    Board.prototype.colGravity = function (duration, column) {
        var space, block;
        for (var i = this.rows - 1; i >= this.ceil; i--) {
            space = this.matrix[i][column];
            if (space !== null) continue;  // current space is not empty, there's a block

            // now we search upwards for blocks to fall down.
            var d = 0;
            for (var k = i - 1; k >= 0; k--) {
                block = this.matrix[k][column];
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
        if (_.some(this.matrix[this.ceil]))
            console.log("you're losing");

        this.matrix.push(this.nextRow);
        _.each(this.nextRow, function (block) { block.awake(); });

        this.rows++;
        this.nextRow = this.newRow();

        this.ceil++;
        this.blockContainer.y = this.ceil * -globals.blocks.size;

        this.blockContainer.setChildIndex(this.swapper, 0);

        new createjs.Tween(this.blockContainer, {override: true})
            .to({x: this.blockContainer.x, y: this.blockContainer.y - globals.blocks.size}, this.speed)
            .call(function(tween) { board.moveBlocks(); });

        // debug..
        // var matched = this.matchingBlocks();
        // _.each(matched, function (blockList) {
        //     _.each(blockList, function (block) { block.matched = true; });
        // });
        // console.log('-------------------');
        // console.log(this.ceil, this.rows, this.matrix.length);
        // _.each(this.matrix, function (row) {
        //     console.log(
        //         row[0] === null ? 'b' : row[0].color,
        //         row[1] === null ? 'b' : row[1].color,
        //         row[2] === null ? 'b' : row[2].color,
        //         row[3] === null ? 'b' : row[3].color,
        //         row[4] === null ? 'b' : row[4].color,
        //         row[5] === null ? 'b' : row[5].color
        //     );
        // });
    };

    Board.prototype.newRow = function (i, y) {
        i = i || this.rows;
        y = y || i * globals.blocks.size;

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
        for (var i = this.ceil; i < this.rows; i++)
            for(var j = 0; j < this.cols; j++) {
                if (this.matrix[i][j] === null) continue;
                rect = new createjs.Graphics();
                rect.setStrokeStyle(1);
                rect.beginStroke(createjs.Graphics.getRGB(255, 255, 255));
                rect.rect(j * globals.blocks.size, (i - this.ceil) * globals.blocks.size, globals.blocks.size, globals.blocks.size);
                this.mG.addChild(new createjs.Shape(rect));
                label = new createjs.Text('(' + i + ', ' + j + ', ' + this.matrix[i][j].color + ')', '10px Arial', 'white');
                label.x = j * globals.blocks.size + 8;
                label.y = (i - this.ceil) * globals.blocks.size + 18;
                this.mG.addChild(label);
            }

        var board = this,
            matched = this.matchingBlocks();
        _.each(matched, function (blockList) {
            _.each(blockList, function (block) {
                // block.matched = true;
                block.explote(board);
            });
        });
        this.blocksGravity(0);


        this.stage.update();
    };

    Board.prototype.handle = function(event){
        var board = this, matched;
        this.swapper.handle(event);

        // debug...
        if (event.key === events.K_ESC) {
            matched = this.matchingBlocks();
            _.each(matched, function (blockList) {
                _.each(blockList, function (block) {
                    block.explote(board);
                });
            });
            this.blocksGravity(1000);
        }
        if (event.key === events.K_ENTER) {
            this.moveBlocks();
        }

    };
    return Board;
});
