var Binding = require('./Binding');
var _       = require('underscore');

module.exports = WithBindings = require('typedef')

// Be able to add / remove bindings, and cleanly unbind all
.mixin('WithBindings') .define({

    // Ensure that we unbind if we need to
    setDataContext: function(ds)
    {
        if (this.dataContext)
            this.unbindAll();

        this.dataContext = ds;
    },

    // Create a binding and track it internally
    addBinding: function(prop, target, tProp)
    {
        this.dataContext = this.dataContext || this;

        var bindings = this._bindings = this._bindings || {};
        var binding  = bindings[prop];

        if (!binding) {
            binding = new Binding().setSource(this.dataContext, prop);
            bindings[prop] = binding;
        }

        return binding.setTarget(target, tProp);
    },

    // Reset and remove all bindings
    unbindAll: function()
    {
        var bindings = this._bindings;

        _(this._bindings).each(function(binding, key) {
            binding.clearTargets();
        });
    },

});
