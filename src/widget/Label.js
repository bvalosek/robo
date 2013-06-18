define(function(require) {

    var View    = require('robo/view/View');
    var compose = require('compose');

    return compose.class('Label').extends(View).define({

        __override__readonly__tagName: 'button',

        __observable__caption: 'hey',

        __override__fluent__render: function()
        {
            this.element.innerHTML = this.caption;
            return this;
        }

    });

});
