define(function(require) {

    var compose = require('compose');
    var Layout  = require('robo/view/Layout');

    // A Layout that is intented to be in the <body>
    return compose.class('RootLayout').extends(Layout).define({

        __override__tagName  : 'body',

        __fluent__inflate: function()
        {
            this.setElement(document.querySelector('body'));
            this.element.className = this.constructor.__name__;
            this.render();

            return this;
        }

    });

});
