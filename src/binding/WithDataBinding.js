define(function(require) {

    var compose = require('compose');

    // Give an object the ability to have an underlying data binded object
    // (e.g., a View can bind to a ViewModel)
    return compose.mixin('WithViewDataBinding').define({

        process: function()
        {
        },

    });

});
