var compose = require('compose');
var Layout  = require('../view/Layout');

// A Layout that is intented to be in the <body>
module.exports = compose.class('RootLayout').extends(Layout).define({

    __override__readonly__tagName  : 'body',

    __fluent__inflate: function()
    {
        this.setElement(document.querySelector('body'));
        this.element.className = this.constructor.__name__;
        this.render();

        return this;
    }

});

