define(function(require, exports, module) {

    var Base = require('./Base');
    var _    = require('underscore');
    var $    = require('jquery');

    // queue up functions taht return a deferred object, ensuring that they happen
    // sequentially
    var DeferredQueue = Base.extend({

        // optionally provide a single function that is being queued
        constructor: function(fn, context)
        {
            this._queue = [];
            this._fn = context ? fn.bind(context) : fn;
        },

        queue: function()
        {
            var args = _(arguments).toArray();
            var d    = new $.Deferred();

            this._queue.push({
                args: args,
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

            // call when the running fn finishes or after the stack clears if
            // it's not a deferred object
            if (d && d.then) {
                d.then(function(retValue) {
                    info.promise.resolve(retValue);

                    // keep going if we have stuff, otherwise we're done
                    if (this._queue.length)
                        this._runQueue();
                    else
                        this._running = false;

                }.bind(this));
            } else {
                info.promise.resolve();
            }
        }

    });

    return DeferredQueue;

});
