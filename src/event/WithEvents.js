define(function(require) {

    var compose  = require('compose');
    var Backbone = require('backbone');
    var _        = require('underscore');

    // Mixin used to add eventing ability to an object
    return compose.mixin('WithEvents').define(_({

        // Output events to the log for this object
        logEvents: function()
        {
            this.on('all', function(e) {
                console.log(this.constructor.__name__ + ' -> ' + e);
            });
        }

    }).extend(Backbone.Events));

});
