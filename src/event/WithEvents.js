define(function(require, exports, module) {

    var compose  = require('compose');
    var Backbone = require('backbone');
    var _        = require('underscore');
    var Log      = require('robo/util/Log');

    compose.namespace('robo.event');

    // Mixin used to add eventing ability to an object and add support for
    // OBSERVABLE and EVENT handler annotations if initEvents() is called
    return compose.mixin('WithEvents').define(_({

        // Called to scan anything we've got with annotations and set up the
        // triggers accordingly
        initEvents: function()
        {
            var _this = this;

            _(this.constructor.__annotations__).each(function(a, key) {

                // Listen for any events
                if (a.EVENT) {
                    _this.on(key, _this[key], _this);
                }

                // Create observable members
                if (a.OBSERVABLE) {
                    _this._observables      = _this.observables || {};
                    _this._observables[key] = _this[key];

                    Log.d(key + ' is observable on ' + _this.constructor.__name__);

                    // install the getter/setter
                    Object.defineProperty(_this, key, {
                        configurable: true, enumberable: true,
                        get: function() {
                            return this._observables[key];
                        },
                        set: function(v) {
                            if (v === _this._observables[key]) return;
                            this._observables[key] = v;
                            this.trigger('change');
                            this.trigger('change:' + key);
                        }
                    });
                }
            });
        },

        // Output events to the log for this object
        logEvents: function()
        {
            this.on('all', function(e) {
                console.log(this.constructor.__fullName__ + ' -> ' + e);
            });
        }

    }).extend(Backbone.Events));

});
