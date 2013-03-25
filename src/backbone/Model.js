define(function(require, exports, module) {

    var compose  = require('../compose');
    var Backbone = require('backbone');

    var Model = Backbone.Model.extend();
    compose.mixin(Model.prototype, compose.withCompose);
    Model.__annotations__ = {};
    Model.__name__ = 'BackboneModel';

    return Model;
});
