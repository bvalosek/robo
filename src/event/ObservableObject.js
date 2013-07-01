define(function(require) {

    var compose    = require('compose');
    var WithEvents = require('robo/event/WithEvents');
    var Log        = require('robo/util/Log');

    // An object that has get, set and observable properties via the OBSERVABLE
    // annotation
    return compose.class('ObservableObject').uses(WithEvents).define({

        // Ensure that all observables are setup properly
        __ondefine__: function(C, signature)
        {
            _(C.__annotations__).each(function(info, key) {
                if (info.OBSERVABLE) {
                    Log.d(key + ' is observable on ' + C.__fullName__);

                    Object.defineProperty(C.prototype, key, {
                        configurable: true, enumberable: true,
                        get: function() {
                            this._observables = this._observables || {};
                            return this._observables[key];
                        },
                        set: function(v) {
                            this._observables = this._observables || {};
                            if (v === this._observables[key]) return;
                            this._observables[key] = v;
                            this.trigger('change');
                            this.trigger('change:' + key);
                        }
                    });
                }
            });
        },

        // Hard set
        __fluent__set: function(key, v)
        {
            this[key] = v;
            return this;
        },

        // Hard get
        get: function(key)
        {
            return this[key];
        }

    });

});
