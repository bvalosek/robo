define(function(require, exports, module) {

    // clean log function
    return function(s)
    {
        if(console.log)
            console.log.apply(console, arguments);
    };

});
