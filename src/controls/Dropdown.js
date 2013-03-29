define(function(require, exports, module) {

    var SelectControl = require('./SelectControl');

    var Dropdown = SelectControl.extend({

        __override__template: require('text!./select/select.html'),

        __override__readonly__tagName: 'select',

        __constructor__Dropdown: function()
        {
            Dropdown.Super.apply(this, arguments);
        }

    });

    return Dropdown;
});
