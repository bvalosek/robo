define(function(require, exports, module) {

    var Base = require('./Base');

    var MS_THRESHOLD = 17;

    var AnimationContext = Base.extend({

        constructor: function() {
            this._queue = [];
        },

        // add an operation the timed animation queue
        queue: function(fn)
        {
            this._queue.push(fn);
            if (!this._running) {
                this._running = true;
                requestAnimationFrame(this._runQueue.bind(this));
            }
        },

        // run through the actions we've queued up until we've bypassed the
        // max alloted time to run stuff in a single frame
        _runQueue: function()
        {
            var t = new Date().getTime();

            while(this._queue.length) {
                var f = this._queue.splice(0, 1);
                f[0]();

                var d = new Date().getTime() - t;

                if (d > MS_THRESHOLD)
                    break;
            }

            if (!this._queue.length)
                this._running = false;
            else
                requestAnimationFrame(this._runQueue.bind(this));
        }
    });

    return AnimationContext;
});
