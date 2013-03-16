define(function(require, exports, module) {

    var compose = require('../compose');
    var log     = require('../log');
    var Timer   = require('../Timer');

    // keep track of timers on an object, clear them out on close. Typically
    // used on a renderable
    var withTimers = compose.createMixin(
    {

        createTimer: function(fn, timeout, context)
        {
            this._timers = this._timers || [];

            var t = new Timer(fn, timeout, context || this);
            this._timers.push(t);

            return t;
        },

        // shut down anything left running
        clearTimers: function()
        {
            if (!this._timers)
                return;

            this._timers.forEach(function(timer) {
                timer.stop();
            });
        },

        __before__close: function()
        {
            this.clearTimers();
        }

    });

    return withTimers;
});
