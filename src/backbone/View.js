define(function(require, exports, module) {

    var Backbone = require('backbone');
    var compose  = require('compose');

    var View = Backbone.View.extend();
    compose.mixin(View.prototype, compose.withCompose);
    _(View.__annotations__).extend(
        compose.processAnnotations(Backbone.View.prototype)
            .annotations);
    compose.defineHidden(View, {
        __name__: 'BackboneView',
        __SuperDuper__: compose.Object,
        Super: compose.Object
    });

    return View;
});
