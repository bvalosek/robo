define(function(require) {

    var compose = require('compose');
    var _       = require('underscore');
    var Log     = require('robo/util/Log');

    var count   = 0;
    var blocked = false;

    var output = function() {
        Log.d('rendered ' + count + ' before unblocking');
        count   = 0;
        blocked = false;
    };

    compose.namespace('robo.util');

    // Output stuff when
    return compose.mixin('WithViewLogging').define({

        // output rendering action
        __before__render: function()
        {
            Log.d('rendering '  + (this.id || this.cid));

            count++;
            if (!blocked) {
                blocked = true;
                _(output).defer();
            }
        },
    });

});
