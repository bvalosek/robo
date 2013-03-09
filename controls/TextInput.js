define(function(require, exports, module) {

    var Control = require('../Control');

    var TextInput = Control.extend({

        constructor: function(opts)
        {
            TextInput.Super.call(this, {
                tagName: 'input',
                attributes: {
                    type: 'text'
                }
            });

            this.model = opts.model;
            this.param = opts.param;

            // dynamic
            if (this.model) {
                var e = this.param ? 'change:' + this.param : 'change';
                this.listenTo(this.model, e, this.render);

                this.delegate('keyup', this.onType);
            }
        },

        onType: function()
        {
            this.setValue(this.$el.val());
        },

        render: function()
        {
            this.$el.val(this.getValue());
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

    return TextInput;
});
