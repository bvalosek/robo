define(function(require, exports, module) {

    var compose  = require('compose');
    var Backbone = require('backbone');

    compose.namespace('backbone');

    return compose.classFromConstructor(Backbone.Collection, 'BackboneCollection');

});
