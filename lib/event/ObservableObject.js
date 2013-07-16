var WithObservableProperties = require('../model/WithObservableProperties');
var typedef                  = require('typedef');
var _                        = require('underscore');

module.exports = ObservableObject = typedef

// An object that has get, set and observable properties via the OBSERVABLE
// decoration. Serves as the base of anything we want to have dependencies and
// observable properties
.class('ObservableObject') .uses(WithObservableProperties) .define({

    // Ensure that we bind any of the EVENT decorations
    __constructor__: function(_props)
    {
        // EVENTs need to be bound
        this.initEvents();

        // Used for tracking dependency access
        this.__frames = [];
        this.__deps   = {};

        // Allow constructor to setup observable properties
        if (_props)
            this.addProperties(_props);
    },

    // Update private version of property and trigger listeners. Also
    // setup/takedown existing listeners if the property itself is observable
    setProperty: function(prop, val)
    {
        var _key = '_' + prop;

        var oldValue = this[_key];
        if (val === oldValue) return;

        // unsub from all previous events (if we potentially were listening, in
        // the case of having an observable observable object)
        if (typedef.is(oldValue, WithObservableProperties)) {
            this.stopListening(oldValue, 'change');
        }

        // if we're setting to observable object, make sure to re-broadcast
        // events
        if (typedef.is(val, WithObservableProperties)) {
            this.listenTo(val, 'change', function(e) {
                this.triggerPropertyChanged(prop);
            });
        }

        // Normal behavior
        this[_key] = val;
        this.triggerPropertyChanged(prop);

        // Scan all deps when we set this stuff, trigger prop changes if we
        // need to. VERY inefficient for now
        var _this = this;
        _(this.__deps).each(function(deps, compProp) {
            if (_this.expandDependencies(compProp).indexOf(prop) !== -1)
                _this.triggerPropertyChanged(compProp);
        });
    },

    // Given a property, return an array of dependencies recursively. If the
    // property isn't computed, then it will be a single-item array
    expandDependencies: function(prop)
    {
        // if no deps or no deps for this prop, we're done
        if (!this.__deps[prop])
            return [prop];

        var r     = [];
        var _this = this;

        _(_this.__deps[prop]).each(function(d) {
            r = r.concat(_this.expandDependencies(d));
        });

        return r;
    },

    // Access a basic member
    getProperty: function(prop)
    {
        // Track this access
        if (this.__frames.length)
            this.__frames[this.__frames.length - 1].push(prop);

        return this['_' + prop];
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
        // Push our stuff onto the stack to track all dependencies
        var frame = [];
        this.__frames.push(frame);
        var val = compFn.call(this);
        this.__frames.pop();

        this.__deps[prop] = frame;

        return val;
    },

    // Method used for setting up the accesses to get at the private data in
    // the _key location
    __static__addProperty: function(target, key, value, readOnly)
    {
        var _key = '_' + key;

        // Cause accessor actions to trigger events
        Object.defineProperty(target, key, {
            configurable: true, enumberable: true,

            // return hidden property
            get: function() {
                return this.getProperty(key);
            },

            // Set the value, and setup any listeners if the value we're
            // setting it to also observable
            set: readOnly ? undefined : function(v) {
                this.setProperty(key, v);
            }
        });
    },

    // Add properties to a particular instance after it has been instantiated
    __fluent__addProperties: function(hash)
    {
        var _this = this;
        _(hash).each(function(value, key) {
            ObservableObject.addProperty(_this, key, undefined);

            // this is done to ensure we setup any listeners that we need
            _this.setProperty(key, value);
        });

        return this;
    },

    // Ensure that all observables are setup properly on define
    __ondefine__: function(C)
    {
        _(C.__signature__).each(function(info, key) {
            if (info.decorations.OBSERVABLE || info.decorations.COMPUTED) {

                var value  = info.value;
                var target = C.prototype;
                var _key   = '_' + key;

                // If it is a funciton, we need to make sure and monitor for
                // any observable access during its evaluation
                if (_(info.value).isFunction()) {
                    ObservableObject.addProperty(target, key, value, true);

                    // Where we would have a property, put a getter for the
                    // computer to get the val
                    Object.defineProperty(target, _key, {
                        configurable: true, enumberable: false,
                        get: function() {
                            return this.getComputedValue(key, value); }
                    });

                } else {
                    ObservableObject.addProperty(target, key, value);

                    // Actaul value here, ensure it is set to the starting value
                    // from the hash
                    Object.defineProperty(target, _key, {
                        configurable: true, enumberable: false,
                        writable: true, value: value
                    });

                }
            }
        });
    }

});
