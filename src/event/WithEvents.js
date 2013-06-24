define(function(require, exports, module) {

    var compose  = require('compose');
    var Backbone = require('backbone');
    var _        = require('underscore');
    var Log      = require('robo/util/Log');

    compose.namespace('robo.event');

    // Mixin used to add eventing ability to an object and add support for
    // OBSERVABLE and EVENT handler annotations if initEvents() is called
    return compose.mixin('WithEvents').define(_({

        // Called to scan anything we've got with annotations and set up the
        // triggers accordingly
        initEvents: function()
        {
            var _this = this;

            _(this.constructor.__annotations__).each(function(a, key) {

                // Listen for any events
                if (a.EVENT) {
                    _this.on(key, _this[key], _this);
                }
            });
        },

        // Output events to the log for this object
        logEvents: function()
        {
            this.on('all', function(e) {
                console.log(this.constructor.__fullName__ + ' -> ' + e);
            });
        }

    }).extend(Backbone.Events));

});
