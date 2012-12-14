define(['modules/helpers/loader','modules/helpers/events','modules/globals', 'easel'], function(loader, events, globals) {
    var Controller = function(){
        this.x = 100; //Initial x position
        this.y = 300; //Initial y position

        this.initialize(loader.get(globals.assets.handler));
    };

    Controller.prototype = new createjs.Bitmap();

    Controller.prototype.onTick = function (msDuration) {
        this.y -= globals.difficulty['easy'].speed;
    };

    Controller.prototype.handle = function (event){
        if (event.key == events.K_DOWN)
            this.y += 50;
        else if(event.key == events.K_UP)
            this.y -= 50;
        else if(event.key == events.K_LEFT && this.x != 0)
            this.x -= 50;
        else if(event.key == events.K_RIGHT && this.x != 200)
            this.x += 50;
    };

    return Controller;
});