var _ = require('underscore');

module.exports = require('typedef')


// Give us the abilit yto have computed values via tracking computed values
.mixin('WithDependencyTracking') .define({

    __before__getProperty: function(prop)
    {
        if (this._frame !== undefined)
            this._frame.push(prop);
    },

    // After we do a normal set, trigger anything that is dependent
    __after__setProperty: function(prop, val)
    {
        var _this = this;

        // Scan all deps
        _(this._deps).find(function(deps, compProp) {

            // Check to see if this is a dep
            return _(deps).each(function(dep) {
                if (dep === prop) {
                    _this.triggerPropertyChanged(compProp);
                    return true;
                }
            });
        });
    },

    // Do the function required for computing values, while recording all
    // observable access during. We can then listen to changes to those
    // dependencies and emit our own change events for the computed value
    getComputedValue: function(prop)
    {
        var _prop = '_' + prop;
        this._frame = [];

        // RUN IT
        var val = this[_prop]();

        this._deps       = this._deps || {};
        this._deps[prop] = this._frame;
        this._frame      = undefined;

        return val;
    },

    // ensure that any computed things are functions, and store them in
    // "private" vars
    __ondefine__: function(C)
    {
        _(C.__signature__).each(function(info, key) {
            if (info.decorations.COMPUTED) {
                var _key = '_' + key;

                // Starting value is undefined. It will be filled out the first
                // time it is evaluated
                Object.defineProperty(C.prototype, _key, {
                    configurable: true, enumberable: false,
                    writable: true, value: info.value
                });

                // Cause accessor actions to trigger events
                Object.defineProperty(C.prototype, key, {
                    configurable: true, enumberable: true,

                    // return hidden property
                    get: function() { return this.getComputedValue(key); },

                    // Set the value, and setup any listeners if the value
                    // we're setting it to also observable
                    set: undefined
                });
            }
        });
    }

});
