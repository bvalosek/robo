define(function(require, exports, module) {

    var Control = require('../Control');

    var Button = Control.extend({

        constructor: function(opts)
        {
            Button.Super.call(this, {
                tagName: 'button'
            });

            opts = opts || {};

            this.caption  = opts.caption || 'Button ' + this.cid;
            this._onClick = opts.onClick.bind(opts.context || opts.parentView);
        },

        __viewEvent__click: function()
        {
            this._onClick();
        },

        // just update the button caption on render
        __override__render: function()
        {
            this.$el.html(this.caption);
        }

    });

    return Button;

});
