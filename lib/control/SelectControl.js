var ContentControl = require('./ContentControl');
var ItemsControl   = require('./ItemsControl');
var typedef        = require('typedef');
var _              = require('underscore');

module.exports = SelectControl = typedef

.class('SelectControl') .extends(ItemsControl) .define({

    __override__readonly__tagName: 'select',

    __observable__isMultiSelect: false,

    __observable__comboSize: 1,

    __observable__selectedItem: null,

    __constructor__: function()
    {
        var _this = this;

        this.onPropertyChange('isMultiSelect', function() {
            this.setAttributes({ multiple: this.isMultiSelect });
        });

        this.onPropertyChange('comboSize', function() {
            this.setAttributes({ size: this.comboSize });
        });

        this.onPropertyChange('selectedItem', this._changeSelectedItem);

        this.element.onchange = this._updateSelectedItem.bind(this);
    },

    // Update our selectedItem property based on the DOM's currently selected
    // item
    _updateSelectedItem: function()
    {
        var itemIndex = this.element.childNodes[this.element.selectedIndex].value;
        this.selectedItem = this.items.get(itemIndex);
    },

    // Update the DOM to reflect our selectedItem property
    _changeSelectedItem: function()
    {
        var _this = this;
        var itemIndex = _this.items.indexOf(_this.selectedItem);

        _(this.element.childNodes).each(function(node, index) {
            if (node.value == itemIndex)
                _this.element.selectedIndex = index;
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
