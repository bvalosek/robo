define(function(require) {

    var compose = require('compose');

    // Parsing an abbreviated version of json (without the quotes around all
    // the keys, no brackets needed for single k/v pair)
    return compose.class('RJson').define({

        __static__parse: function(s)
        {
            s = s.trim();
            var m;

            // wrap in quotes if we need to
            if (!s.match(/^{[\s\S]*}/m))
                s = '{' + s + '}';

            // handle single value
            m = s.match(/^{\s*([^:\s]+)\s*:\s*(.*)}$/);
            if (m) {
                var r  = {};
                r[m[1]] = eval(m[2]);
                return r;
            }


            console.log(s);
            return JSON.parse(s);
        }

    });

});
