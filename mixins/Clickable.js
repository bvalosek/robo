define(function(require, exports, module) {

    var compose = require('../compose');

    // interface for anything that should be able to handle a click event from
    // a view-like
    var Clickable = compose.defineMixin({

        __abstract__viewevent__click : undefined

    });

    return Clickable;
});
