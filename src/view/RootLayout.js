define(function(require) {

    var compose      = require('compose');
    var TemplateView = require('robo/view/TemplateView');

    // A TemplateView that is intented to be in the <body>
    return compose.class('RootLayout').extends(TemplateView).define({

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
