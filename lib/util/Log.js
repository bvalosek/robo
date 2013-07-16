module.exports = Log = require('typedef')

// Utility class used for simplifying logging
.class('Log') .define({

    __static__d: function(m)
    {
        Log.useConsole('debug', m);
    },

    __static__w: function(m)
    {
        Log.useConsole('warn', m);
    },

    __static__i: function(m)
    {
        Log.useConsole('info', m);
    },

    __static__e: function(m)
    {
        Log.useConsole('error', m);
    },

    __static__useConsole: function(key, m)
    {
        if (console)
            if (console[key])
                console[key](m);
            else if (console.log)
                console.log(m);
    }

});
