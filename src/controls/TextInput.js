define(function(require, exports, module) {

    var ModelControl = require('./ModelControl');
    var _            = require('underscore');

    var TextInput = ModelControl.extend({

        __override__readonly__tagName: 'input',

        __override__readonly__attributes: {
            type: 'text'
        },

        __viewEvent__keyup: function()
        {
            this.setValue(this.$el.val());
        },

        __override__render: function()
        {
            this.$el.val(this.getValue());
        }

    });

    return TextInput;
});
