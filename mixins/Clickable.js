define(function(require, exports, module) {

    var compose = require('../compose');

    var Clickable = compose.defineMixin({

        __abstract__viewevent__click : undefined

    });

    return Clickable;
});
