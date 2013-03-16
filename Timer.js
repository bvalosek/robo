define(function(require, exports, module) {

    var Base = require('./Base');
    var log  = require('./log');

    var Timer = Base.extend({

        constructor: function(fn, timeout, context)
        {
            this.id = null;
            this.fn = fn;
            this.timeout = timeout || 0;
            this.context = context || this;
        },

        triggerAndStart: function()
        {
            this.fn.call(this.context);
            this.start();
        },

        start: function()
        {
            if (!this.fn)
                return null;

            if (!this.id) {
                var f = this.fn.bind(this.context);
                this.id = setInterval(f, this.timeout);
                log ('starting timer ' + this.id);
            }

            return this.id;
        },

        stop: function()
        {
            if (!this.id)
                return;

            log ('stopping timer ' + this.id);
            clearInterval(this.id);

            this.id = null;
        }

    });

    return Timer;
});
