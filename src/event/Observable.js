define(function(require, exports, module) {

    var compose = require('compose');

    return compose.interface('Observable').define({

        on      : function(name, callback, context) {},
        off     : function(name, callback, context) {},
        once    : function(name, callback, context) {},
        trigger : function(name) {}

    });

});
