define(function(require, exports, module) {

    var _        = require('underscore');
    var Backbone = require('backbone');

    // mixin backbone events
    var withEvents =  function() {
        _(this).extend(Backbone.Events);
    };

    return withEvents;

});
