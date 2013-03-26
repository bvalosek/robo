define(function(require, exports, module) {

    var compose  = require('../compose');
    var Backbone = require('backbone');
    var helpers  = require('../compose/helpers');

    var Model = Backbone.Model.extend();
    compose.mixin(Model.prototype, compose.withCompose);
    _(Model.__annotations__).extend(
        helpers.processAnnotations(Backbone.Model.prototype)
            .annotations);
    helpers.defHidden(Model, {
        __name__: 'BackboneModel',
        __SuperDuper__: compose.Object,
        Super: compose.Object
    });

    return Model;
});
