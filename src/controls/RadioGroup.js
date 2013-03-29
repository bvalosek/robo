define(function(require, exports, module) {

    var SelectControl = require('./SelectControl');

    var RadioGroup = SelectControl.extend({

        __override__readonly__tagName: 'span',

        __override__template: require('text!./select/radios.html'),

        __constructor__RadioGroup: function()
        {
            RadioGroup.Super.apply(this, arguments);
        },

    });

    return RadioGroup;
});
