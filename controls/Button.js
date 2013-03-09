define(function(require, exports, module) {

    var Control = require('../Control');

    var Button = Control.extend({

        constructor: function(opts)
        {
            Button.Super.call(this, {
                tagName: 'button'
            });

            opts = opts || {};

            this.caption = opts.caption || 'Button ' + this.cid;

            if (opts.onClick)
                this.onClick = opts.onClick.bind(opts.context || this.parent);

            this.delegate('click', this.onClick);
        },

        // just update the button caption on render
        render: function()
        {
            this.$el.html(this.caption);
        },

        // do something
        onClick: function() {}

    });

    return Button;

});
