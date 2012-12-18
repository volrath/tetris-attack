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
        this.swapper.i--;
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


    Board.prototype.swapBlocks = function(){
          this.swapper.moving=true;
          var oLeftBlock = this.matrix[this.swapper.i][this.swapper.j];
          var oRightBlock = this.matrix[this.swapper.i][this.swapper.j+1];
          var k = this.swapper.i;
          var swapper = this.swapper;
          var block = null;
          var matrix = this.matrix;

          // Case where both block exist inside the swapper
          if (oLeftBlock !== null && oRightBlock !== null){
              this.matrix[this.swapper.i][this.swapper.j+1]=this.matrix[this.swapper.i][this.swapper.j];
              this.matrix[this.swapper.i][this.swapper.j]=oRightBlock;
              var leftBlock=this.matrix[this.swapper.i][this.swapper.j];
              leftBlock.j--;
              createjs.Tween.get(leftBlock)
                  .to({x: leftBlock.x-globals.blocks.size, y:leftBlock.y}, 100);
              var rightBlock=this.matrix[this.swapper.i][this.swapper.j+1];
              rightBlock.j++;
              createjs.Tween.get(rightBlock)
                .to({x: rightBlock.x+globals.blocks.size, y:rightBlock.y}, 100);
          }

          // Case where only left block exists inside the swapper
          else if (oLeftBlock !== null){
                // now we search upwards for blocks to fall down.
                for (k; k <= this.rows - 1; k++) {
                    block = this.matrix[k][this.swapper.j+1];
                    if (block !== null){
                        k--;
                        break
                    }
                }
                createjs.Tween.get(oLeftBlock)
                  .to({x: oLeftBlock.x+globals.blocks.size, y:oLeftBlock.y}, 100)
                    .call(function(){
                        matrix[swapper.i][swapper.j]=null;
                        oLeftBlock.j++;
                        (k !== swapper.i) ? oLeftBlock.fallTo(matrix, k, 100) : matrix[swapper.i][swapper.j+1]=oLeftBlock;
                    })
          }

          // Case where only right block exists inside the swapper
          else if (oRightBlock !== null){
                // now we search upwards for blocks to fall down.
                for (k; k <= this.rows - 1; k++) {
                    block = this.matrix[k][this.swapper.j];
                    if (block !== null){
                        k--;
                        break
                    }
                }
                createjs.Tween.get(oRightBlock)
                  .to({x: oRightBlock.x-globals.blocks.size, y:oRightBlock.y}, 100)
                    .call(function(){
                        matrix[swapper.i][swapper.j+1]=null;
                        oRightBlock.j--;
                        (k !== swapper.i) ? oRightBlock.fallTo(matrix, k, 100) : matrix[swapper.i][swapper.j]=oRightBlock;
                    })
          }
          this.swapper.moving=false;
    };

    Board.prototype.handle = function(event){
        var board = this;
        this.swapper.handle(event);
        if (event.key == events.K_SPACE){
            this.swapBlocks();
            var matched = this.matchingBlocks();
            _.each(matched, function (blockList) {
                _.each(blockList, function (block) {
                    board.blockContainer.removeChild(block);
                    board.matrix[block.i][block.j] = null;
                    delete block;
                });
            });
            this.blocksGravity(100);
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
