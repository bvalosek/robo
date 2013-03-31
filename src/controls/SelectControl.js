define(function(require, exports, module) {

    var ModelControl    = require('./ModelControl');
    var IOptionProvider = require('../mixins/IOptionProvider');
    var OptionArray     = require('./OptionArray');

    var SelectControl = ModelControl.extend({

        __constructor__SelectControl: function(opts)
        {
            SelectControl.Super.apply(this, arguments);

            // for the options, provide either an IOptionProvider or an array /
            // hash
            if (opts.options && opts.options.is && opts.options.is(IOptionProvider)) {
                this.optionProvider = opts.options;
            } else if (_(opts.options).isObject()) {
                this.optionProvider = new OptionArray(opts.options);
            } else {
                throw new Error ('Must provide SelectControl with an IOptionProvider');
            }
        }

    });

    return SelectControl;
});
