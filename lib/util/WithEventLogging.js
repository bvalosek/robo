var typedef = require('typedef');
var Log     = require('../util/Log');

// Used for debugging IEvents objects
module.exports = typedef.mixin('WithEventLogging').define({

    __before__fluent__on : function(name, callback, _context)
    {
        Log.d(this + ' is listening for ' + name);
    },

    __before__fluent__off : function(_name, _callback, _context)
    {
        Log.d(this + ' is no longer listening for ' +
            (name || '[anything]'));
    },

    __before__fluent__listenTo : function(obj, name, callback)
    {
        Log.d(this + ' is listening to ' + obj + ' for ' + name);
    },

    __before__fluent__stopListening : function(_obj, _name, _callback)
    {
        Log.d(this + ' is no listening to ' + (_obj || '[anything]') +
            ' for ' + (name || '[anything]'));
    },

    __before__fluent__trigger__ : function(name, _options)
    {
        Log.d(this + ' fired ' + name);
    }

});
