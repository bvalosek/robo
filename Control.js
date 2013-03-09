define(function(require, exports, module) {

    var TemplateView = require('./TemplateView');

    var Control = TemplateView.extend({

        constructor: function(opts)
        {
            Control.Super.apply(this, arguments);

            if (opts && opts.attributes)
                this._attributes = opts.attributes;

            this.addClass('control');
        }

    });

    return Control;

});
