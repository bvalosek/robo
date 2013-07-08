var compose = require('compose');

module.exports = compose.class('Log').define({

    __static__d: function(m)
    {
        console.debug(m);
    }

});
