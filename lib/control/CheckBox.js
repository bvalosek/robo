var ContentControl = require('./ContentControl');
var Input          = require('./Input');

module.exports = CheckBox = require('typedef')

.class('CheckBox') .extends(ContentControl) .define({

    __override__readonly__tagName : 'label',

    __observable__checked: false,

    __constructor__: function()
    {
        var _this = this;
        this._checkbox = new Input()
            .onDomEvent('click', function() { _this.checked = !_this.checked; })
            .setAttributes({ type: 'checkbox' });

        this.onPropertyChange('checked', this._updateCheck);
        this.render();
    },

    _updateCheck: function()
    {
        this._checkbox.element.checked = !!this.checked;
    },

    __override__fluent__render: function()
    {
        if (!this._checkbox)
            return this;

        ContentControl.prototype.render.call(this);
        this.element.insertBefore(this._checkbox.element, this.element.firstChild);
    },

    __domEvent__click: function()
    {
        this.checked = !!this._checkbox.element.checked;
    },

});
