define(function(require) {

    var compose       = require('compose');
    var View          = require('robo/view/View');
    var ClickListener = require('robo/view/ClickListener');

    return compose.class('Button')
        .extends(View)
        .implements(ClickListener).define({

        __override__readonly__tagName : 'button',
        __observable__caption         : null,

        __virtual__event__click: function(event)
        {
        },

        __override__fluent__render: function()
        {
            if (this.caption === null)
                return;

            this.element.innerText = this.caption;
            return this;
        }

    });
});
