define(function(require, exports, module) {

    var compose = require('../compose');
    var log     = require('../log');

    // keep track of timers on an object, clear them out on close. Typically
    // used on a renderable
    var withTimers = function()
    {

        // execute immediately + setup interval
        this.doInterval = function(fn, timeout, context)
        {
            fn.call(context || this);
            return this.setInterval(fn, timeout, context);
        };

        // keep track
        this.setInterval = function(fn, timeout, context)
        {
            this._timers = this._timers || [];
            context = context || this;

            var tId = setInterval(fn.bind(context), timeout);
            log ('starting timer ' + tId);
            this._timers.push(tId);

            return tId;
        };

        // shut down anything left running
        this.clearTimers = function()
        {
            // optimize
            if (!this._timers)
                return;

            this._timers.forEach(function(tId) {
                log('stopping timer ' + tId);
                clearInterval(tId);
            });
        };

        this.close = compose.wrap(this.close, function(close, args) {
            this.clearTimers();
            close();
        });
    };

    return withTimers;
});
