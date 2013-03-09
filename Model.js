define(function(require, exports, module) {

    var compose = require('./compose');

    // create BackboneModel that has the compose.js goodies baked in
    var BackboneModel = Backbone.Model.extend();
    compose.mixin(BackboneModel.prototype, compose.withCompose);

    var Model = BackboneModel.extend({

    });

    return Model;
});
