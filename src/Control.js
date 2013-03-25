define(function(require, exports, module) {

    var TemplateView = require('./TemplateView');

    var Control = TemplateView.extend({

        // html tag attributes
        __virtual__readonly__attributes: {},

        __constructor__Control: function(opts)
        {
            Control.Super.apply(this, arguments);
        }

    });

    return Control;

});
