define(function(require, exports, module) {

    var compose = require('compose');

    var Adapter = compose.using(Observable).defineMixin({

        __abstract__getCount: undefined

    });

    return Adapter;
});
