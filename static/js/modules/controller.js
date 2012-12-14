define(['modules/globals','easel'], function(globals) {
    var Controller = function(stage){
        this.initialPosition = {
            'x':100,
            'y':100
        };
        this.bitmap = new requirejs.Bitmap(globals.assets.handler);
        this.bitmap.x = this.initialPosition.x;
        this.bitmap.y = this.initialPosition.y;
        stage.addChild(this.bitmap);
        stage.update();
    }
});