define(['lodash'], function(_) {
    var QUEUE = [];

    var EVENT_TYPES = {
        K_UP: 38,
        K_DOWN: 40,
        K_RIGHT: 39,
        K_LEFT: 37,

        K_SPACE: 32,
        K_BACKSPACE: 8,
        K_TAB: 9,
        K_ENTER: 13,
        K_SHIFT: 16,
        K_CTRL: 17,
        K_ALT: 18,
        K_ESC: 27,

        K_0: 48,
        K_1: 49,
        K_2: 50,
        K_3: 51,
        K_4: 52,
        K_5: 53,
        K_6: 54,
        K_7: 55,
        K_8: 56,
        K_9: 57,
        K_a: 65,
        K_b: 66,
        K_c: 67,
        K_d: 68,
        K_e: 69,
        K_f: 70,
        K_g: 71,
        K_h: 72,
        K_i: 73,
        K_j: 74,
        K_k: 75,
        K_l: 76,
        K_m: 77,
        K_n: 78,
        K_o: 79,
        K_p: 80,
        K_q: 81,
        K_r: 82,
        K_s: 83,
        K_t: 84,
        K_u: 85,
        K_v: 86,
        K_w: 87,
        K_x: 88,
        K_y: 89,
        K_z: 90,

        K_KP1: 97,
        K_KP2: 98,
        K_KP3: 99,
        K_KP4: 100,
        K_KP5: 101,
        K_KP6: 102,
        K_KP7: 103,
        K_KP8: 104,
        K_KP9: 105,

        // event type constants
        NOEVENT: 0,
        NUMEVENTS: 32000,

        QUIT: 0,
        KEY_DOWN: 1,
        KEY_UP: 2,
        MOUSE_MOTION: 3,
        MOUSE_UP: 4,
        MOUSE_DOWN: 5,
        MOUSE_WHEEL: 6,
        USEREVENT: 2000
    };

    var get = function () {
        return QUEUE.splice(0, QUEUE.length);
    };

    var poll = function () {
        return QUEUE.pop();
    };

    var post = function (userEvent) {
        QUEUE.push(userEvent);
        return;
    };

    var clear = function () {
        QUEUE = [];
        return;
    };

    var init = function () {
        var lastPos = [];

        // anonymous functions as event handlers = memory leak, see MDC:elementAddEventListener

        function onMouseDown (ev) {
            QUEUE.push({
                'type': EVENT_TYPES.MOUSE_DOWN,
                'pos': [ev.clientX, ev.clientY],
                'button': ev.button,
                'shiftKey': ev.shiftKey,
                'ctrlKey': ev.ctrlKey,
                'metaKey': ev.metaKey
            });
        }

        function onMouseUp (ev) {
            QUEUE.push({
                'type': EVENT_TYPES.MOUSE_UP,
                'pos': [ev.clientX, ev.clientY],
                'button': ev.button,
                'shiftKey': ev.shiftKey,
                'ctrlKey': ev.ctrlKey,
                'metaKey': ev.metaKey
            });
        }

        function onKeyDown (ev) {
            var key = ev.keyCode || ev.which;
            QUEUE.push({
                'type': EVENT_TYPES.KEY_DOWN,
                'key': key,
                'shiftKey': ev.shiftKey,
                'ctrlKey': ev.ctrlKey,
                'metaKey': ev.metaKey
            });

            if ((!ev.ctrlKey && !ev.metaKey &&
                 ((key >= EVENT_TYPES.K_LEFT && key <= EVENT_TYPES.K_DOWN) ||
                  (key >= EVENT_TYPES.K_0    && key <= EVENT_TYPES.K_z) ||
                  (key >= EVENT_TYPES.K_KP1  && key <= EVENT_TYPES.K_KP9) ||
                  key === EVENT_TYPES.K_SPACE ||
                  key === EVENT_TYPES.K_TAB ||
                  key === EVENT_TYPES.K_ENTER)) ||
                key === EVENT_TYPES.K_ALT ||
                key === EVENT_TYPES.K_BACKSPACE) {
                ev.preventDefault();
            }
        }

        function onKeyUp (ev) {
            QUEUE.push({
                'type': EVENT_TYPES.KEY_UP,
                'key': ev.keyCode,
                'shiftKey': ev.shiftKey,
                'ctrlKey': ev.ctrlKey,
                'metaKey': ev.metaKey
            });
        }

        function onMouseMove (ev) {
            var currentPos = [ev.clientX, ev.clientY];
            var relativePos = [];
            if (lastPos.length) {
                relativePos = [
                    lastPos[0] - currentPos[0],
                    lastPos[1] - currentPos[1]
                ];
            }
            QUEUE.push({
                'type': EVENT_TYPES.MOUSE_MOTION,
                'pos': currentPos,
                'rel': relativePos,
                'buttons': null, // FIXME, fixable?
                'timestamp': ev.timeStamp
            });
            lastPos = currentPos;
            return;
        }

        function onMouseScroll(ev) {
            var currentPos = [ev.clientX, ev.clientY];
            QUEUE.push({
                type: EVENT_TYPES.MOUSE_WHEEL,
                pos: currentPos,
                delta: ev.detail || (- ev.wheelDeltaY / 40)
            });
            return;
        }

        function onBeforeUnload (ev) {
            QUEUE.push({
                'type': EVENT_TYPES.QUIT
            });
            return;
        }

        // IEFIX does not support addEventListener on document itself
        // MOZFIX but in moz & opera events don't reach body if mouse outside window or on menubar
        document.addEventListener('mousedown', onMouseDown, false);
        document.addEventListener('mouseup', onMouseUp, false);
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);
        //document.addEventListener('mousemove', onMouseMove, false);
        //document.addEventListener('mousewheel', onMouseScroll, false);
        // MOZFIX
        // https://developer.mozilla.org/en/Code_snippets/Miscellaneous#Detecting_mouse_wheel_events
        //document.addEventListener('DOMMouseScroll', onMouseScroll, false);
        document.addEventListener('beforeunload', onBeforeUnload, false);

    };

    return _.extend(EVENT_TYPES, {
        // methods
        get: get,
        poll: poll,
        post: post,
        clear: clear,
        init: init
    });
});
