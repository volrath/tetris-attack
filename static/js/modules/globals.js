define([], function() {
    return {
        assets: {
            blocks: [
                '/static/images/blocks/blue.png',
                '/static/images/blocks/green.png',
                '/static/images/blocks/purple.png',
                '/static/images/blocks/red.png',
                '/static/images/blocks/yellow.png'
            ],
            handler: '/static/images/handler.png'
        },
        blocks: {
            size: 50,
            states: {  // taken from crack-attack's states  -  https://github.com/gnu-lorien/crack-attack/blob/master/src/Block.h
                static: 0,
                swapping: 1,
                falling: 2,
                dying: 3,
                awaking: 4
            }
        },
        difficulty: {
            easy: {speed: 0.1},
            normal: {speed: 0.2},
            hard: {speed: 0.2}
        }
    };
});