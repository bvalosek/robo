define(function(require, exports, module) {

    var helpers = {};

    // apply 
    helpers.applyToConstructor = function(T)
    {
        return new (Function.prototype.bind.apply(T, arguments))();
    };

    return helpers;
});
