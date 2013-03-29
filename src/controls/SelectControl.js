define(function(require, exports, module) {

    var ModelControl    = require('./ModelControl');
    var IOptionProvider = require('../mixins/IOptionProvider');
    var OptionArray     = require('./OptionArray');

    var SelectControl = ModelControl.extend({

        __constructor__SelectControl: function(opts)
        {
            SelectControl.Super.apply(this, arguments);

            if (opts.options && opts.options.is && opts.options.is(IOptionProvider)) {
                this.optionProvider = opts.options;
            } else if (_(opts.options).isArray()) {
                this.optionProvider = new OptionArray(opts.options);
            } else if (_(opts.options).isObject()) {
                this.optionProvider = new OptionArray(opts.options);
            } else {
                throw new Error ('Must provide SelectControl with an IOptionProvider');
            }
        }

    });

    return SelectControl;
});
