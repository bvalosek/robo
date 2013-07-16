var WithEvents             = require('../event/WithEvents');
var IEvents                = require('../event/IEvents');
var WithDependencyTracking = require('../event/WithDependencyTracking');
var typedef                = require('typedef');
var _                      = require('underscore');

module.exports = ObservableObject = typedef

// An object that has get, set and observable properties via the OBSERVABLE
// decoration
.class('ObservableObject')
    .uses(WithEvents, WithDependencyTracking)
    .implements(IEvents)
    .define({

    // Ensure that we bind any of the EVENT decorations
    __constructor__: function(_props)
    {
        this.initEvents();

        if (_props)
            this.addProperties(_props);
    },

    // Fire off the event
    triggerPropertyChanged: function(prop)
    {
        this.trigger('change');
        this.trigger('change:' + prop);
    },

    setProperty: function(prop, val)
    {
        var _key = '_' + prop;

        var oldValue = this[_key];
        if (val === oldValue) return;

        // unsub from all previous events (if we potentially were listening, in
        // the case of having an observable observable object)
        if (typedef.is(oldValue, ObservableObject)) {
            this.stopListening(oldValue, 'change');
        }

        // if we're setting to observable object, make sure to re-broadcast
        // events
        if (typedef.is(val, ObservableObject)) {
            this.listenTo(val, 'change', function(e) {
                this.triggerPropertyChanged(prop);
            });
        }

        // Normal behavior
        this[_key] = val;
        this.triggerPropertyChanged(prop);
    },

    getProperty: function(prop)
    {
        return this['_' + prop];
    },

    // Create a new property to this instance of the object
    __static__addProperty: function(target, key, value)
    {
        var _key = '_' + key;

        // Actaul value here, ensure it is set to the starting value
        // from the hash
        Object.defineProperty(target, _key, {
            configurable: true, enumberable: false,
            writable: true, value: value
        });

        // Cause accessor actions to trigger events
        Object.defineProperty(target, key, {
            configurable: true, enumberable: true,

            // return hidden property
            get: function() { return this.getProperty(key); },

            // Set the value, and setup any listeners if the value
            // we're setting it to also observable
            set: function(v) { this.setProperty(key, v); }
        });
    },

    // Add properties to a particular instance
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
            if (info.decorations.OBSERVABLE) {

                var value  = info.value;
                var target = C.prototype;

                ObservableObject.addProperty(target, key, value);
            }
        });
    }

});

module.exports = ObservableObject;
