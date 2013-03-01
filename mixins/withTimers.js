define(function(require, exports, module) {

    var compose = require('../compose');
    var log     = require('../log');
    var Timer   = require('../Timer');

    // keep track of timers on an object, clear them out on close. Typically
    // used on a renderable
    var withTimers = function()
    {

        this.createTimer = function(fn, timeout, context)
        {
            this._timers = this._timers || [];

            var t = new Timer(fn, timeout, context || this);
            this._timers.push(t);

            return t;
        };

        // shut down anything left running
        this.clearTimers = function()
        {
            if (!this._timers)
                return;

            this._timers.forEach(function(timer) {
                timer.stop();
            });
        };

        this.close = compose.wrap(this.close, function(close, args) {
            this.clearTimers();
            close();
        });
    };

    return withTimers;
});
