define(function(require, exports, module) {

    var ModelControl = require('./ModelControl');
    var _            = require('underscore');

    var Label = ModelControl.extend({

        __override__readonly__tagName: 'span',

        __constructor__Label: function(opts)
        {
            Label.Super.apply(this, arguments);

            this.caption = opts.caption || 'Label ' + this.cid;

            // bind function to parent
            if (_(this.caption).isFunction())
                this.caption = this.caption.bind(opts.parentView);
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
