define(function(require, exports, module) {

    var compose  = require('./compose');
    var Backbone = require('backbone');

    // create BackboneCollection that has the compose.js goodies baked in
    var BackboneCollection = Backbone.Collection.extend();
    compose.mixin(BackboneCollection.prototype, compose.withCompose);

    var Collection = BackboneCollection.extend({

        // should be overridden to point to endpoint
        __virtual__url: '',

        // should be overridden
        __virtual__model: null

    });

    return Collection;
});
