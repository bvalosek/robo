define(function(require) {

    var compose  = require('compose');
    var Backbone = require('backbone');
    var IEvents  = require('robo/event/IEvents');
    var _        = require('underscore');

    // Mixin used to add eventing ability to an object
    return compose.mixin('WithEvents')
        .implements(IEvents)
        .define(_({

        // Output events to the log for this object
        __fluent__logEvents: function()
        {
            var tag = this.cid || this.id || this.TAG ||
                this.constructor.__name__;

            this.on('all', function(e) {
                console.log(tag + ' -> ' + e);
            });

            return this;
        }

    }).extend(Backbone.Events));

});
