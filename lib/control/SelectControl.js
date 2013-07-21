var ContentControl = require('./ContentControl');
var ItemsControl   = require('./ItemsControl');

module.exports = SelectControl = require('typedef')

.class('SelectControl') .extends(ItemsControl) .define({

    __override__readonly__tagName: 'select',

    __observable__isMultiSelect: false,

    __observable__comboSize: 1,

    __observable__selectedItem: function() {
        if (!this.element.options ||
            this.element.selectedIndex === undefined)
                return;

        var option = this.element.options[this.element.selectedIndex];
        if (!option)
            return;

        return this.items.get(0|option.value);
    },

    __constructor__: function()
    {
        this.onPropertyChange('isMultiSelect', function() {
            this.setAttributes({ multiple: this.isMultiSelect });
        });

        this.onPropertyChange('comboSize', function() {
            this.setAttributes({ size: this.comboSize });
        });

        var _this = this;
        this.element.onchange = function() {
            _this.triggerPropertyChanged('selectedItem');
        };
    },

    // Probably should be data template thing
    __override__createItemView: function(item)
    {
        var index = this.items.indexOf(item);
        return new ContentControl({tag: 'option' })
            .setAttributes({ value: index })
            .setContent(item);
    }

});
