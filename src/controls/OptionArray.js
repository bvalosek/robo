define(function(require, exports, module) {

    var compose         = require('compose');
    var IOptionProvider = require('../mixins/IOptionProvider');
    var _               = require('underscore');

    var OptionArray = compose.Object.using(IOptionProvider).extend({

        // either give it a straitche up array or a simple key/value object
        // hash
        __constructor__OptionArray: function(a)
        {
            this.options = {};

            if (_(a).isArray()) {
                a.forEach(function(val) {
                    this.options[val] = val;
                }.bind(this));
            } else if (_(a).isObject()) {
                this.options = a;
            }
        },

        __override__selectOption: function(key)
        {
            var s = this.options[key];

            if (s === undefined)
                throw new Error ('Option not found');

            this.selected = key;
        },

        __override__getSelectedOption: function()
        {
            return this.options[this.selected];
        },

        __override__getOptions: function()
        {
            return this.options;
        }

    });

    return OptionArray;
});
