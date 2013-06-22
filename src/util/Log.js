define(function(require, exports, module) {

    var compose = require('compose');

    compose.namespace('robo.util');

    return compose.class('Log').define({

        __static__d: function(m)
        {
            console.debug(m);
        }

    });

});
