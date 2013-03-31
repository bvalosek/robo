define(function(require, exports, module) {

    var compose = require('compose');

    // any object that implements the backbone-style events, means we can call
    // listenTo(obj) on it
    var Observable = compose.defineMixin({

        __abstract__on: undefined,
        __abstract__off: undefined,
        __abstract__once: undefined

    });

    return Observable;
});
