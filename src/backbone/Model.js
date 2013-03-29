define(function(require, exports, module) {

    var Backbone = require('backbone');
    var compose  = require('compose');

    var Model = Backbone.Model.extend();
    compose.mixin(Model.prototype, compose.withCompose);
    _(Model.__annotations__).extend(
        compose.processAnnotations(Backbone.Model.prototype)
            .annotations);
    compose.defineHidden(Model, {
        __name__: 'BackboneModel',
        __SuperDuper__: compose.Object,
        Super: compose.Object
    });

    return Model;
});
