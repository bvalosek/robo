define(function(require, exports, module) {

    var ModelControl = require('./ModelControl');
    var _            = require('underscore');

    var Label = ModelControl.extend({

        __override__readonly__tagName: 'span',

        __constructor__Label: function(opts)
        {
            Label.Super.apply(this, arguments);

            // bind function to parent
            if (_(this.caption).isFunction())
                this.caption = this.caption.bind(opts.parentView);

            // provided mode and attribute but no caption
            else if (this.model && this.attribute && !this.caption)
                this.caption = function() {
                    return this.model.get(this.attribute);
                }.bind(this);

            // no model or attribute
            else (!this.model || !this.attribute)
                this.caption = this.caption || 'Label ' + this.cid;
        },

        getCaption: function()
        {
            return _(this).result('caption');
        },

        __override__render: function()
        {
            this.$el.html(this.getCaption());
        }

    });

    return Label;
});
