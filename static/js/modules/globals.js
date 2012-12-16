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
        blockSize: 50,
        difficulty: {
            easy: {speed: 0.1},
            normal: {speed: 0.2},
            hard: {speed: 0.2}
        }
    };
});