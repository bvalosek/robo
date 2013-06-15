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
                if (a.EVENT) {
                    _this.on(key, _this[key], _this);
                }
            });
        },

    }).extend(Backbone.Events));

});
