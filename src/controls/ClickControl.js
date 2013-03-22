define(function(require, exports, module) {

    var Control   = require('../Control');
    var Clickable = require('../mixins/Clickable');

    var ClickControl = Control.using(Clickable).extend({

        __virtual__tagName: 'div',

        __constructor__ClickControl: function(opts)
        {
            ClickControl.Super.apply(this, arguments);

            opts = opts || {};
            this._onClick = opts.onClick.bind(opts.context || opts.parentView);
        },

        __override__viewevent__click: function()
        {
            if (this._onClick)
                this._onClick();
        }

    });

    return ClickControl;

});
