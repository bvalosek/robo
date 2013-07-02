define(function(require) {

    var compose      = require('compose');
    var ValueControl = require('robo/widget/ValueControl');
    var Binding      = require('robo/event/Binding');

    return compose.class('TextInput').extends(ValueControl).define({

        __override__tagName: 'input',

        __constructor__: function()
        {
            var _this = this;

            this.on('keyup', function() {
                _this.trigger(Binding.TARGET_PROPERTY_CHANGED);
            });
        },

    });

});
