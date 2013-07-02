define(function(require) {

    var compose    = require('compose');
    var WithEvents = require('robo/event/WithEvents');
    var Log        = require('robo/util/Log');

    // An object that has get, set and observable properties via the OBSERVABLE
    // annotation
    return compose
        .class('ObservableObject')
        .uses(WithEvents)
        .define({

        // Ensure that all observables are setup properly on define
        __ondefine__: function(C, signature)
        {
            _(C.__signature__).each(function(info, key) {
                if (info.decorations.OBSERVABLE) {
                    var _key = '_' + key;

                    // Cause accessor actions to trigger events
                    Object.defineProperty(C.prototype, key, {
                        configurable: true, enumberable: true,
                        get: function() {
                            return this[_key];
                        },
                        set: function(v) {
                            if (v === this[_key]) return;
                            this[_key] = v;
                            this.trigger('change');
                            this.trigger('change:' + key);
                        }
                    });
                }
            });
        },

        get: function(key)
        {
            return this['_' + key];
        },

        set: function(key, v)
        {
            var _key = '_' + key;
            if (v === this[_key]) return;
            this[_key] = v;
            this.trigger('change');
            this.trigger('change:' + key);
        },


    });

});
