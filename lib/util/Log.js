var typedef = require('typedef');

module.exports = typedef.class('Log').define({

    __static__d: function(m)
    {
        if (console)
            if (console.debug)
                console.debug(m);
            else if (console.log)
                console.log(m);
    }

});
