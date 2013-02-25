define(function(require, exports, module) {

    var compose = require('./compose');

    var Base = function() {};

    compose.mixin(Base.prototype, compose.withCompose);

    return Base;
});
