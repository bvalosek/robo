define(function(require, exports, module) {

    var ModelControl = require('./ModelControl');

    var Label = ModelControl.extend({

        constructor: function(opts)
        {
            _(opts).extend({ tagName: 'span' });

            Label.Super.call(this, opts);

            this.caption = opts.caption || 'Label ' + this.cid;

            // bind function to parent
            if (_(this.caption).isFunction())
                this.caption = this.caption.bind(opts.parentView);
        },

        getCaption: function()
        {
            return _(this).result('caption');
        },

        render: function()
        {
            this.$el.html(this.getCaption());
        }

    });

    return Label;
});
