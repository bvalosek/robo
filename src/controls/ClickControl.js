define(function(require, exports, module) {

    var View      = require('../view/View');
    var Clickable = require('./Clickable');

    var ClickControl = View.using(Clickable).extend({

        __constructor__ClickControl: function(opts)
        {
            ClickControl.Super.apply(this, arguments);

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
