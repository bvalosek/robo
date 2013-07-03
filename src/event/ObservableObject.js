define(function(require) {

    var compose    = require('compose');
    var WithEvents = require('robo/event/WithEvents');

    // An object that has get, set and observable properties via the OBSERVABLE
    // decoration
    var ObservableObject = compose
        .class('ObservableObject')
        .uses(WithEvents)
        .define({

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
                            if (v === this[_key]) return;

                            // unsub from all previous events
                            if (compose.is(this[_key], ObservableObject)) {
                                this.stopListening(this[_key]);
                            }

                            // if we're setting to observable object, make sure
                            // to re-broadcast events
                            if (compose.is(v, ObservableObject)) {
                                this.listenTo(v, 'all', function(e) {
                                    if(e === 'change') {
                                        this.trigger('change');
                                        this.trigger('change:' + key);
                                    }
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

    return ObservableObject;

});
