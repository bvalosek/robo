define(function(require, exports, module) {

    var View = require('../view/View');

    // A control that is used to display and/or edit a model or a model's
    // attribute. Think text input, check boxes, etc
    var ModelControl = View.extend({

        __constructor__ModelControl: function(opts)
        {
            ModelControl.Super.apply(this, arguments);

            // update dynamically
            if (this.model) {
                var e = this.param ? 'change:' + this.param : 'change';
                this.listenTo(this.model, e, this.render);
            }
        },

        // set the value of the bound model. attribute is optional is control
        // is init with attribute
        setValue: function(attribute, val)
        {
            if (!this.model)
                return;

            if (val === undefined) {
                val = attribute;
                attribute = this.attribute;
            }

            this.model.set(attribute, val);
        },

        getValue: function(attribute)
        {
            if (!this.model)
                return;

            if (attribute === undefined)
                attribute = this.attribute;

            return this.model.attributes[attribute];
        }

    });

    return ModelControl;
});
