define(function(require, exports, module) {

    var TemplateView = require('./TemplateView');

    var Control = TemplateView.extend({

        __constructor__Control: function(opts)
        {
            Control.Super.apply(this, arguments);
        }

    });

    return Control;

});
