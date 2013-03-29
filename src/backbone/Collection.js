define(function(require, exports, module) {

    var compose  = require('compose');
    var Backbone = require('backbone');

    var Collection = Backbone.Collection.extend();
    compose.mixin(Collection.prototype, compose.withCompose);
    _(Collection.__annotations__).extend(
        compose.processAnnotations(Backbone.Collection.prototype)
            .annotations);
    compose.defineHidden(Collection, {
        __name__: 'BackboneCollection',
        __SuperDuper__: compose.Object,
        Super: compose.Object
    });

    return Collection;
});
