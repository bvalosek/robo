define(function(require) {

    var compose = require('compose');

    // A proxy object that can install a getter/setter in another object that
    // will dynamically reflect whatever source is set. In addition, change
    // events can be listened to
    return compose.class('Observable').define({

        getValue: function()
        {
        },

        setValue: function(v)
        {
        },

        setSource: function(source)
        {
        },

    });

});
