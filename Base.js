define(function(require, exports, module) {

    var compose = require('./compose');

    // Base object contains all the fun stuff from compose.js
    var Base = function() {};
    compose.mixin(Base.prototype, compose.withCompose);
    Base.__annotations__ = {};

    return Base;
});
