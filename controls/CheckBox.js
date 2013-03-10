define(function(require, exports, module) {

    var ModelControl = require('./ModelControl');

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

            // toggle on click
            this.delegate('click', function() {
                this.setValue(!this.getValue());
            });
        },

        // really just toggle the check based on state
        render: function()
        {
            this.$el.prop('checked', this.getValue());
        }

    });

    return CheckBox;
});
