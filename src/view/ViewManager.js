define(function(require, exports, module) {

    var compose = require('compose');

    // any thing that let's you add and remvoe views
    var ViewManager = compose.defineMixin({

        __abstract__addView: undefined,

        __abstract__removeView: undefined

    });

    return ViewManager;
});
