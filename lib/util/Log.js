var typedef = require('typedef');

module.exports = typedef.class('Log').define({

    __static__d: function(m)
    {
        console.debug(m);
    }

});
