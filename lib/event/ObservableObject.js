var WithEvents             = require('../event/WithEvents');
var IEvents                = require('../event/IEvents');
var WithDependencyTracking = require('../event/WithDependencyTracking');
var WithPropertyReflection = require('../util/WithPropertyReflection');
var typedef                = require('typedef');
var _                      = require('underscore');

module.exports = ObservableObject = typedef

// An object that has get, set and observable properties via the OBSERVABLE
// decoration
.class('ObservableObject')
    .uses(WithEvents, WithPropertyReflection, WithDependencyTracking)
    .implements(IEvents)
    .define({

    // Ensure that we bind any of the EVENT decorations
    __constructor__: function()
    {
        this.initEvents();
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
            this.stopListening(oldValue);
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

    // Ensure that all observables are setup properly on define
    __ondefine__: function(C)
    {
        _(C.__signature__).each(function(info, key) {
            if (info.decorations.OBSERVABLE) {
                var _key = '_' + key;

                // Actaul value here, ensure it is set to the starting value
                // from the hash
                Object.defineProperty(C.prototype, _key, {
                    configurable: true, enumberable: false,
                    writable: true, value: info.value
                });

                // Cause accessor actions to trigger events
                Object.defineProperty(C.prototype, key, {
                    configurable: true, enumberable: true,

                    // return hidden property
                    get: function() { return this.getProperty(key); },

                    // Set the value, and setup any listeners if the value
                    // we're setting it to also observable
                    set: function(v) { this.setProperty(key, v); }
                });
            }
        });
    }

});

module.exports = ObservableObject;
