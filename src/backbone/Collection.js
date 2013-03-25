define(function(require, exports, module) {

    var compose  = require('../compose');
    var Backbone = require('backbone');

    var Collection = Backbone.Collection.extend();
    compose.mixin(Collection.prototype, compose.withCompose);
    Collection.__annotations__ = {};
    Collection.__name__ = 'BackboneCollection';

    return Collection;
});
