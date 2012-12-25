define(function(require, exports, module) {

    var _       = require('underscore');
    var helpers = {};

    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

    helpers.newGuid = function()
    {
        return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
    };

    // add to ret object
    return helpers;
});
