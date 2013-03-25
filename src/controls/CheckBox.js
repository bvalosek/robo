define(function(require, exports, module) {

    var ModelControl = require('./ModelControl');
    var _            = require('underscore');

    var CheckBox = ModelControl.extend({

        __override__readonly__tagName: 'input',

        __override__readonly__attributes: {
            type: 'checkbox'
        },

        __viewEvent__click: function()
        {
            this.setValue(!this.getValue());
        },

        // really just toggle the check based on state
        __override__render: function()
        {
            this.$el.prop('checked', this.getValue());
        }

    });

    return CheckBox;
});
