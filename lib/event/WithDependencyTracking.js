var _ = require('underscore');

module.exports = require('typedef')


// Give us the abilit yto have computed values via tracking computed values
.mixin('WithDependencyTracking') .define({

    __before__getProperty: function(prop)
    {
        if (this._frames && this._frames.length) {
            var frame = this._frames[this._frames.length -1];
            frame.push(prop);
        }
    },

    // After we do a normal set, trigger anything that is dependent
    __after__setProperty: function(prop, val)
    {
        var _this = this;

        // Scan all deps when we set this stuff
        _(this._deps).find(function(deps, compProp) {
            if (_this.expandDependencies(compProp).indexOf(prop) !== -1) {
                _this.triggerPropertyChanged(compProp);
            }
        });
    },

    // Do the function required for computing values, while recording all
    // observable access during. We can then listen to changes to those
    // dependencies and emit our own change events for the computed value
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

    // Given a property, return an array of dependencies
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

    // ensure that any computed things are functions, and store them in
    // "private" vars
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
