define(function(require, exports, module) {

    var log     = require('../log');
    var _       = require('underscore');
    var compose = require('compose');

    // mixin to output any triggered events
    var withEventLogging = compose.defineMixin(
    {
        getTag: function()
        {
           return this.cid || this.id || this.TAG || '?';
        },

        __wrapped__trigger: function(trigger, args)
        {
            var eventName = args[0];
            var data = args[1];

            log(this.getTag() + ' -> ' + eventName);

            trigger.apply(this, args);
        },

        __wrapped__on: function(on, args)
        {
            log(this.getTag() + ' listening for ' + args[0]);
            on.apply(this, args);
        },

        __wrapped__off: function(off, args)
        {
            log(this.getTag() + ' cleared for ' + args[0]);
            off.apply(this, args);
        }

    });

    return withEventLogging;
});
