define(function(require, exports, module) {

    var compose = require('../compose');
    var log     = require('../log');

    // mixin to output any triggered events
    var withEventLogging = function()
    {
        this.trigger = compose.wrap(this.trigger, function(trigger, args) {
            var eventName = args[0];
            var data = args[1];

            var tag = this.cid || this.id || this.TAG || '?';

            log(tag + ' <- ' + eventName);
            trigger.apply(this, args);
        });
    };

    return withEventLogging;
});
