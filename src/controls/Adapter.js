define(function(require, exports, module) {

    var compose    = require('compose');
    var Observable = require('../event/Observable');

    var Adapter = compose.using(Observable).defineMixin({
        __name__: 'Adapter',

        // return a view with a specific id
        __abstract__getView: undefined,

        // get the total number of items
        __abstract__getCount: undefined,

        // get an item with a spcific id
        __abstract__getItem: undefined

    });

    return Adapter;
});
