define(function(require, exports, module) {

    var _          = require('underscore');
    var compose    = require('compose');
    var Backbone   = require('backbone');
    var Observable = require('../interfaces/Observable');

    // mixin backbone events
    var withEvents =  compose.using(Observable).defineMixin(Backbone.Events);
    withEvents.__name__ = 'withEvents';

    return withEvents;

});
