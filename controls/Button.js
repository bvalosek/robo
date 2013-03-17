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
        },

        // just update the button caption on render
        __override__render: function()
        {
            this.$el.html(this.caption);
        }

    });

    return Button;

});
