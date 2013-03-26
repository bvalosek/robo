define(function(require, exports, module) {

    var compose  = require('../compose');
    var Backbone = require('backbone');
    var helpers  = require('../compose/helpers');

    var Collection = Backbone.Collection.extend();
    compose.mixin(Collection.prototype, compose.withCompose);
    _(Collection.__annotations__).extend(
        helpers.processAnnotations(Backbone.Collection.prototype)
            .annotations);
    helpers.defHidden(Collection, {
        __name__: 'BackboneCollection',
        __SuperDuper__: compose.Object,
        Super: compose.Object
    });

    return Collection;
});
