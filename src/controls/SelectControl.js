define(function(require, exports, module) {

    var ModelControl    = require('./ModelControl');

    // any control used for chosing one of multiple options
    var SelectControl = ModelControl.extend({

        __constructor__SelectControl: function(opts)
        {
            SelectControl.Super.apply(this, arguments);
        }

    });

    return SelectControl;
});
