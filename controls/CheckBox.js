define(function(require, exports, module) {

    var Control = require('../Control');
    var _       = require('underscore');

    var CheckBox = Control.extend({

        constructor: function(opts)
        {
            CheckBox.Super.call(this, {
                tagName: 'input',
                attributes: {
                    type: 'checkbox'
                }
            });

            opts = opts || {};

            _(this).extend({
                model   : opts.model,
                param   : opts.param
            });

            if (this.model && this.param) {
                this.listenTo(this.model, 'change:' + this.param, this.render);
            }

            // toggle on click
            this.delegate('click', function() {
                this.setValue(!this.getValue());
            });
        },

        // really just toggle the check
        render: function()
        {
            this.$el.prop('checked', this.getValue());
        },

        setValue: function(param, val)
        {
            if (!this.model)
                return;

            if (val === undefined) {
                val = param;
                param = this.param;
            }

            this.model.set(param, val);
        },

        getValue: function()
        {
            if (this.model && this.param)
                return this.model.attributes[this.param];

            return null;
        }

    });

    return CheckBox;
});
