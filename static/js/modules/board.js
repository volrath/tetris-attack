define(['easel'], function() {
    var Board = function (stage) {
        this.stage = stage;

        this.rows   = 11;
        this.cols   = 6;
        this.matrix = [];
        for (var i = 0; this.matrix.length < this.rows; i++) {
            this.matrix.push([]);
            while(this.matrix[i].push(0) < this.cols);
        }
    };

    Board.prototype.switch = function (cursor) {

    };

    Board.prototype.update = function (msDuration) {

    };

    return Board;
});
