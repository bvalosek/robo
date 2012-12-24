define(function(require, exports, module) {

    var _       = require('underscore');
    var helpers = {};

    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

    helpers.guid = function()
    {
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    // add to ret object
    _(exports).extend(helpers);
});
