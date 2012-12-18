define(['modules/helpers/loader','modules/helpers/events','modules/globals', 'easel','tween'], function(loader, events, globals) {
    var Swapper = function(){
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
            console.log(this.i+":"+this.j);
        }
    };

    return Swapper;
});