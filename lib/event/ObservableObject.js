var WithObservableProperties = require('../event/WithObservableProperties');
var typedef                  = require('typedef');
var _                        = require('underscore');

module.exports = ObservableObject = typedef

// An object that has get, set and observable properties via the OBSERVABLE
// decoration. Serves as the base of anything we want to have dependencies and
// observable properties
.class('ObservableObject') .uses(WithObservableProperties) .define({

    __constructor__: function(_props)
    {
        this.initEvents();

        this.__frames = [];
        this.__deps   = {};

        if (_props)
            this.addProperties(_props);
    },

    // Update private version of property and trigger listeners. Also
    // setup/takedown existing listeners if the property itself is observable
    setProperty: function(prop, val)
    {
        var _key = '_' + prop;

        if (this.__frames.length)
            this.__frames[this.__frames.length - 1].push(prop);

        var oldValue = this[_key];
        if (val === oldValue) return;

        if (typedef.is(oldValue, WithObservableProperties)) {
            this.stopListening(oldValue, 'change');
        }

        if (typedef.is(val, WithObservableProperties)) {
            this.listenTo(val, 'change', function(e) {
                this.triggerPropertyChanged(prop);
            });
        }

        this[_key] = val;
        this.triggerPropertySet(prop);

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
    getComputedValue: function(prop, compFn, _args)
    {
        var frame = [];
        var val;

        this.__frames.push(frame);
        if (_args)
            compFn.apply(this, _args);
        else
            val = compFn.call(this);
        this.__frames.pop();

        this.__deps[prop] = frame;
        return val;
    },

    // Method used for setting up the accesses to get at the private data in
    // the _key location
    __static__addProperty: function(target, key, value)
    {
        var _key = '_' + key;

        Object.defineProperty(target, key, {
            configurable: true, enumberable: true,

            get: function() {
                return this.getProperty(key);
            },

            set: function(v) {
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

                ObservableObject.addProperty(target, key, value);

                var def = { configurable: true, enumberable: false };

                if (_(value).isFunction()) {
                    def.get = function() {
                        return this.getComputedValue(key, value); };

                } else if (_(value).isObject() && (value.get || value.set)) {
                    def.get = function() {
                        return this.getComputedValue(key, value.get); };
                    def.set = function(v) {
                        this.getComputedValue(key, value.set, [v]); };

                } else {
                    def.writable = true;
                    def.value    = value;
                }

                Object.defineProperty(target, _key, def);
            }
        });
    }

});
