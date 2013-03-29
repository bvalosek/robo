define(function(require, exports, module) {

    var compose = require('compose');
    var _       = require('underscore');
    var $       = require('jquery');

    // queue up functions taht return a deferred object, ensuring that they happen
    // sequentially
    var DeferredQueue = compose.defineClass({

        // optionally provide a single function that is being queued
        __constructor__DeferredQueue: function(fn, context)
        {
            this._queue = [];
            this._fn = context ? fn.bind(context) : fn;
        },

        queue: function()
        {
            // create a new promise that we resolve later whenever the queue
            // gets to this task
            var d    = new $.Deferred();

            this._queue.push({
                args: _(arguments).toArray(),
                promise: d
            });

            if (!this._running);
                this._runQueue();

            return d;
        },

        _runQueue: function()
        {
            this._running = true;

            var info = this._queue.splice(0, 1)[0];
            var args = info.args;

            var d = this._fn.apply(this, args);

            // when done, resolve the promise we gave back to the original
            // caller from the queue and see if we need to keep going
            var whenDone = function(ret) {

                // return the value resolved via the promise or the direct
                // response from the queued function
                info.promise.resolve(ret || d);

                // keep going if we have stuff, otherwise we're done
                if (this._queue.length)
                    this._runQueue();
                else
                    this._running = false;
            }.bind(this);

            // wait if it's deferred, otherwise just plow
            if (d && d.then)
                d.then(whenDone);
            else
                whenDone();
        }

    });

    return DeferredQueue;

});
