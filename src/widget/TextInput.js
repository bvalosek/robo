define(function(require) {

    var compose      = require('compose');
    var ValueControl = require('robo/widget/ValueControl');
    var Binding      = require('robo/event/Binding');

    return compose.class('TextInput').extends(ValueControl).define({

        __override__tagName: 'input',

        __event__keyup: function()
        {
            this.trigger(Binding.TARGET_PROPERTY_CHANGED);
        }

    });

});
