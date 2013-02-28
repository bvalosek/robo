define(function(require, exports, module) {

    var compose = require('../compose');
    var log     = require('../log');
    var _       = require('underscore');

    // mixin to output any triggered events
    var withEventLogging = function()
    {
        this.getTag = function()
        {
           return this.cid || this.id || this.TAG || '?';
        };

        this.trigger = compose.wrap(this.trigger, function(trigger, args) {
            var eventName = args[0];
            var data = args[1];

            log(this.getTag() + ' -> ' + eventName);

            trigger.apply(this, args);
        });

        this.on = compose.wrap(this.on, function(on, args) {
            log(this.getTag() + ' listening for ' + args[0]);
            on.apply(this, args);
        });

        this.off = compose.wrap(this.off, function(off, args) {
            log(this.getTag() + ' cleared for ' + args[0]);
            off.apply(this, args);
        });
    };

    return withEventLogging;
});
