define(function(require) {

    var compose       = require('compose');
    var Widget        = require('robo/widget/Widget');
    var ClickListener = require('robo/view/ClickListener');
    var Log           = require('robo/util/Log');

    return compose.class('Button')
        .extends(Widget)
        .implements(ClickListener).define({

        __override__readonly__tagName: 'button',

        caption: 'Button',

        __virtual__event__click: function(event)
        {
            Log.d('Button click');
        },

        __override__fluent__render: function()
        {
            this.element.innerText = this.caption;
            return this;
        }

    });

});
