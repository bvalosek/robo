define(function(require, exports, module) {

    var ClickControl = require('./ClickControl');

    var Button = ClickControl.extend({

        __override__tagName: 'button',

        constructor: function(opts)
        {
            Button.Super.apply(this, arguments);

            opts = opts || {};
            this.caption  = opts.caption || 'Button ' + this.cid;
        },

        // just update the button caption on render
        __override__render: function()
        {
            this.$el.html(this.caption);
        }

    });

    return Button;

});
