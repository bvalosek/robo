define(function(require, exports, module) {

    var SelectControl = require('./SelectControl');
    var withTemplate  = require('../view/withTemplate');

    var Spinner = SelectControl.using(withTemplate).extend({

        template: require('text!./select/select.html'),

        __override__readonly__tagName: 'select',

        __constructor__Spinner: function()
        {
            Spinner.Super.apply(this, arguments);
        }

    });

    return Spinner;
});
