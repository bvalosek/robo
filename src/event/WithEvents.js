define(function(require) {

    var compose  = require('compose');
    var Backbone = require('backbone');
    var _        = require('underscore');

    // Mixin used to add eventing ability to an object
    return compose.mixin('WithEvents')
        .define(_({

        // Bind any events that we've declared via decorations
        initEvents: function()
        {
            var _this = this;
            _(this.constructor.__signature__).each(function(info, key) {
                if (info.decorations.EVENT) {
                    _this.on(key, info.value.bind(_this));
                }
            });
        },

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
