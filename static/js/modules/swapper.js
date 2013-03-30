define(['modules/helpers/loader','modules/helpers/events','modules/globals', 'easel','tween'], function(loader, events, globals) {
    var Swapper = function(board){
        this.board = board;
        this.x = 100; //Initial x position
        this.y = 300; //Initial y position
        this.i = 6;
        this.j = 2;
        this.moving = false;
        this.initialize(loader.get(globals.assets.handler));
    };

    Swapper.prototype = new createjs.Bitmap();

    Swapper.prototype.move = function(movement){
        this.moving = true;
        var swapper = this;
        if (movement == 0){
            this.i--;
            createjs.Tween.get(this).to({x: this.x, y: this.y - globals.blocks.size}, 150, createjs.Ease.quartInOut)
                .call(function() {
                    swapper.moving=false;
                });
        }
        else if(movement == 1){
            this.j++;
            createjs.Tween.get(this).to({x: this.x + globals.blocks.size, y: this.y}, 150, createjs.Ease.quartInOut)
                .call(function() {
                    swapper.moving=false;
                });
        }
        else if(movement == 2){
            this.i++;
            createjs.Tween.get(this).to({x: this.x, y: this.y + globals.blocks.size}, 150, createjs.Ease.quartInOut)
                .call(function() {
                    swapper.moving=false;
                });
        }
        else{
            this.j--;
            createjs.Tween.get(this).to({x: this.x - globals.blocks.size, y: this.y}, 150, createjs.Ease.quartInOut)
                .call(function() {
                    swapper.moving=false;
                });
        }
    };

    Swapper.prototype.handle = function (event){
        if (!this.moving){
            if (event.key == events.K_UP)
                this.move(0);
            else if(event.key == events.K_RIGHT && this.x != 200)
                this.move(1);
            else if(event.key == events.K_DOWN)
                this.move(2);
            else if(event.key == events.K_LEFT && this.x != 0)
                this.move(3);
        }

        if (event.key == events.K_SPACE)
            this.swap();
    };

    /*
     * Swap the two positions of this -> `board`.
     */
    Swapper.prototype.swap = function () {
        this.moving = true;

        var oLeftBlock  = this.board.matrix[this.i][this.j],
            oRightBlock = this.board.matrix[this.i][this.j + 1],
            swapper = this,
            board = this.board,
            k = this.i, block;

        // Case where both block exist inside the swapper
        if (oLeftBlock !== null && oRightBlock !== null) {
            board.matrix[this.i][this.j + 1] = oLeftBlock;
            board.matrix[this.i][this.j] = oRightBlock;

            var leftBlock = board.matrix[this.i][this.j];
            leftBlock.j--;
            createjs.Tween.get(leftBlock).to({x: leftBlock.x - globals.blocks.size, y: leftBlock.y}, 100);

            var rightBlock = board.matrix[this.i][this.j + 1];
            rightBlock.j++;
            createjs.Tween.get(rightBlock).to({x: rightBlock.x + globals.blocks.size, y: rightBlock.y}, 100);
        }

        // Case where only left block exists inside the swapper
        else if (oLeftBlock !== null) {
            // now we search upwards for blocks to fall down.
            for (k; k <= board.rows - 1; k++) {
                block = board.matrix[k][this.j + 1];
                if (block !== null){
                    k--;
                    break;
                }
            }
            createjs.Tween.get(oLeftBlock).to({x: oLeftBlock.x + globals.blocks.size, y: oLeftBlock.y}, 100)
                .call(function() {
                    board.matrix[swapper.i][swapper.j] = null;
                    oLeftBlock.j++;
                    (k !== swapper.i) ? oLeftBlock.fallTo(board.matrix, k, 100) : board.matrix[swapper.i][swapper.j+1] = oLeftBlock;
                    if (board.matrix[swapper.i-1][swapper.j] !== null){ // We apply column gravity if the swapped element has blocks above him
                        board.colGravity(100, swapper.j);
                    }
                });
        }

        // Case where only right block exists inside the swapper
        else if (oRightBlock !== null){
            // now we search upwards for blocks to fall down.
            for (k; k <= board.rows - 1; k++) {
                block = board.matrix[k][this.j];
                if (block !== null){
                    k--;
                    break;
                }
            }
            createjs.Tween.get(oRightBlock).to({x: oRightBlock.x - globals.blocks.size, y: oRightBlock.y}, 100)
                .call(function(){
                    board.matrix[swapper.i][swapper.j+1] = null;
                    oRightBlock.j--;
                    (k !== swapper.i) ? oRightBlock.fallTo(board.matrix, k, 100) : board.matrix[swapper.i][swapper.j] = oRightBlock;
                    if (board.matrix[swapper.i-1][swapper.j+1] !== null) { // We apply column gravity if the swapped element has blocks above him
                        board.colGravity(100, swapper.j+1);
                    }
                });
        }

        this.moving = false;
    };

    return Swapper;
});