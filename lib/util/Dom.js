module.exports = Dom = require('typedef')

// Utility class to use like jquery, used for querying the dom
.class('Dom') .define({

    __constructor__: function(sel)
    {
    },

    __static__select: function(sel)
    {
        return document.querySelectorAll(sel);
    },

    __static__selectFirst: function(sel)
    {
        return document.querySelector(sel);
    },

});
