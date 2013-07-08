var WithEvents = require('../event/WithEvents');
var IEvents    = require('../event/IEvents');
var compose    = require('compose');
var _          = require('underscore');

// An object that has get, set and observable properties via the OBSERVABLE
// decoration
var ObservableObject = compose
    .class('ObservableObject')
    .uses(WithEvents)
    .implements(IEvents)
    .define({

    // Ensure that we bind any of the EVENT decorations
    __constructor__: function()
    {
        this.initEvents();
    },

    // Ensure that all observables are setup properly on define
    __ondefine__: function(C)
    {
        _(C.__signature__).each(function(info, key) {
            if (info.decorations.OBSERVABLE) {
                var _key = '_' + key;

                // starting value
                Object.defineProperty(C.prototype, _key, {
                    configurable: true, enumberable: false,
                    writable: true, value: info.value
                });

                // Cause accessor actions to trigger events
                Object.defineProperty(C.prototype, key, {
                    configurable: true, enumberable: true,

                    // return hidden property
                    get: function() {
                        return this[_key];
                    },

                    set: function(v) {
                        var oldValue = this[_key];
                        if (v === oldValue) return;

                        // unsub from all previous events (if we
                        // potentially were listening, in the case of
                        // having an observable observable object)
                        if (compose.is(oldValue, ObservableObject)) {
                            this.stopListening(oldValue);
                        }

                        // if we're setting to observable object, make sure
                        // to re-broadcast events
                        if (compose.is(v, ObservableObject)) {
                            this.listenTo(v, 'change', function(e) {
                                this.trigger('change');
                                this.trigger('change:' + key);
                            });
                        }

                        // Normal behavior
                        this[_key] = v;
                        this.trigger('change');
                        this.trigger('change:' + key);
                    }
                });
            }
        });
    }

});

module.exports = ObservableObject;
