define(function(require, exports, module) {

    var compose = require('./compose');

    // create BackboneCollection that has the compose.js goodies baked in
    var BackboneCollection = Backbone.Collection.extend();
    compose.mixin(BackboneCollection.prototype, compose.withCompose);

    var Collection = BackboneCollection.extend();

    return Collection;
});
