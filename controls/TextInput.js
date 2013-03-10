define(function(require, exports, module) {

    var ModelControl = require('./ModelControl');
    var _            = require('underscore');

    var TextInput = ModelControl.extend({

        constructor: function(opts)
        {
            _(opts).extend({
                tagName: 'input',
                attributes: {
                    type: 'text'
                }
            });

            TextInput.Super.call(this, opts);

            this.delegate('keyup', this.onType);
        },

        onType: function()
        {
            this.setValue(this.$el.val());
        },

        render: function()
        {
            this.$el.val(this.getValue());
        }

    });

    return TextInput;
});
