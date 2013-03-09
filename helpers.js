define(function(require, exports, module) {

    var helpers = {};

    // apply
    helpers.applyToConstructor = function(T)
    {
        return new (Function.prototype.bind.apply(T, arguments))();
    };

    helpers.getWindowHash = function()
    {
        return window.location.hash.substring(1);
    };

    return helpers;
});
