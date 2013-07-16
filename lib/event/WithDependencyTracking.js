var _ = require('underscore');

module.exports = require('typedef')

// Give us the abilit yto have computed values via tracking computed values
.mixin('WithDependencyTracking') .define({

    // If we are tracking property access, then push this property onto the
    // latest frame on the stack
    __before__getProperty: function(prop)
    {
        if (this._frames && this._frames.length) {
            var n = this._frames.length - 1;
            var frame = this._frames[n];
            frame.push(prop);
            this._frames[n] = _(frame).uniq();
        }
    },

    // After we do a normal set, trigger a change event for any dependent
    // properties, which will cause the computed values to be re-computed
    __after__setProperty: function(prop, val)
    {
        var _this = this;

        // Scan all deps when we set this stuff
        _(this._deps).each(function(deps, compProp) {
            if (_this.expandDependencies(compProp).indexOf(prop) !== -1) {
                _this.triggerPropertyChanged(compProp);
            }
        });
    },

    // Do the function required for computing values, while recording all
    // observable access during. We can then listen to changes to those
    // dependencies and emit our own change events for the computed value.
    //
    // We have to use a stack since a computed value may access other
    // computeds, so we let this frame build up. We can then limit the depth to
    // avoid loops or just really shitty situations
    getComputedValue: function(prop, compFn)
    {
        this._frames = this._frames || [];

        // Push our stuff onto the stack to track all dependencies
        var frame = [];
        this._frames.push(frame);
        var val = compFn.call(this);
        this._frames.pop();

        this._deps       = this._deps || {};
        this._deps[prop] = frame;

        return val;
    },

    // Given a property, return an array of dependencies recursively. If the
    // property isn't computed, then it will be a single-item array
    expandDependencies: function(prop)
    {
        // if no deps or no deps for this prop, we're done
        if (!this._deps || !this._deps[prop])
            return [prop];

        var r     = [];
        var _this = this;

        _(_this._deps[prop]).each(function(d) {
            r = r.concat(_this.expandDependencies(d));
        });

        return r;
    },

    // Create getters on the private variables that are used in the OBSERVABLE
    // decorations as well, then set the actual property to reference via
    // getProperty. This causes for function calls but allows computed to be
    // accessed in the same way as OBSERVABLEs, thus allowing for cleaner dep
    // tracking
    __ondefine__: function(C)
    {
        _(C.__signature__).each(function(info, key) {
            if (info.decorations.COMPUTED) {
                var _key = '_' + key;

                // Where we would have a property, put a getter for the
                // computer to get the val
                Object.defineProperty(C.prototype, _key, {
                    configurable: true, enumberable: false,
                    get: function() {
                        return this.getComputedValue(key, info.value); }
                });

                // Cause accessor actions to trigger events
                Object.defineProperty(C.prototype, key, {
                    configurable: true, enumberable: true,

                    // return hidden property
                    get: function() { return this.getProperty(key); },

                    // Set the value, and setup any listeners if the value
                    // we're setting it to also observable
                    set: undefined
                });
            }
        });
    }

});
