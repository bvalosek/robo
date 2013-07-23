var ContentControl = require('./ContentControl');
var ItemsControl   = require('./ItemsControl');
var typedef        = require('typedef');

module.exports = SelectControl = typedef

.class('SelectControl') .extends(ItemsControl) .define({

    __override__readonly__tagName: 'select',

    __observable__isMultiSelect: false,

    __observable__comboSize: 1,

    __constructor__: function()
    {
        this.onPropertyChange('isMultiSelect', function() {
            this.setAttributes({ multiple: this.isMultiSelect });
        });

        this.onPropertyChange('comboSize', function() {
            this.setAttributes({ size: this.comboSize });
        });

    },

    // Probably should be data template thing
    __override__createItemView: function(item)
    {
        var index = this.items.indexOf(item);
        return new SelectControl.OptionControl()
            .setAttributes({ value: index })
            .setContent(item);
    },

    // the options
    __static__OptionControl: typedef
    .class('OptionControl') .extends(ContentControl) .define({
        __override__readonly__tagName : 'option'
    })

});
