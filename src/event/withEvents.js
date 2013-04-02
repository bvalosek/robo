define(function(require, exports, module) {

    var _          = require('underscore');
    var compose    = require('compose');
    var Backbone   = require('backbone');
    var Observable = require('./Observable');

    // mixin backbone events
    var withEvents =  compose.using(Observable).defineMixin(Backbone.Events);
    compose.defineHidden(withEvents, { __name__: 'withEvents' });

    return withEvents;

});
