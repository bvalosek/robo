define(function(require, exports, module) {

    var compose  = require('compose');
    var Backbone = require('backbone');
    var _        = require('underscore');
    var Log      = require('robo/util/Log');

    return compose.mixin('WithEvents').define(_({

        // Called to scan anything we've got with annotations and set up the
        // triggers accordingly
        initEvents: function()
        {
            var _this = this;

            _(this.constructor.__annotations__).each(function(a, key) {

                // listen for any events
                if (a.EVENT) {
                    _this.on(key, _this[key], _this);
                }

                // create observable members
                if (a.OBSERVABLE) {
                    _this._observables      = _this.observables || {};
                    _this._observables[key] = _this[key];

                    // install the getter/setter
                    Object.defineProperty(_this, key, {
                        configurable: true, enumberable: true,
                        get: function() {
                            return _this._observables[key];
                        },
                        set: function(v) {
                            if (v === _this._observables[key]) return;
                            _this._observables[key] = v;
                            _this.trigger('change');
                            _this.trigger('change:' + key);
                        }
                    });
                }
            });
        },

    }).extend(Backbone.Events));

});
