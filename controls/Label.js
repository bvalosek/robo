define(function(require, exports, module) {

    var Control = require('../Control');

    var Label = Control.extend({

        constructor: function(opts)
        {
            Label.Super.call(this, { tagName: 'span' });

            this.caption = opts.caption || 'Label ' + this.cid;
            this.model   = opts.model;
            this.param   = opts.param;

            // bind function to parent
            if (_(this.caption).isFunction())
                this.caption = this.caption.bind(opts.parentView);

            // dynamic
            if (this.model) {
                var e = this.param ? 'change:' + this.param : 'change';
                this.listenTo(this.model, e, this.render);
            }
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
