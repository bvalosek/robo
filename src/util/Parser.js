define(function(require) {

    var compose = require('compose');

    compose.namespace('robo.util');

    return compose.class('Parser').define({

        __static__parseOptions: function(opts)
        {
            var regex = /\s*([^:\s]+)\s*:\s*([^\s,]+)\s*,?/g;
            var a, r = {};

            while ((a = regex.exec(opts)))
            {
                var key = a[1];
                var val = a[2];
                r[key] = val;
            }

            return r;
        }

    });
});
