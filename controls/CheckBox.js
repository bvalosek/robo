define(function(require, exports, module) {

    var ModelControl = require('./ModelControl');
    var _            = require('underscore');

    var CheckBox = ModelControl.extend({

        constructor: function(opts)
        {
            _(opts).extend({
                tagName: 'input',
                attributes: {
                    type: 'checkbox'
                }
            });

            CheckBox.Super.call(this, opts);
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
