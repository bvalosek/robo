define(function(require, exports, module) {

    var compose = require('compose');

    // ensure that we can listen to an object
    var Observable = compose.defineMixin({

        __abstract__on: undefined,
        __abstract__off: undefined,
        __abstract__once: undefined

    });

    return Observable;
});
