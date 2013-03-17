define(function(require, exports, module) {

    var compose    = require('./compose');
    var Collection = require('./Collection');

    // create BackboneModel that has the compose.js goodies baked in
    var BackboneModel = Backbone.Model.extend();
    compose.mixin(BackboneModel.prototype, compose.withCompose);

    var Model = BackboneModel.extend({

        // Static class let's us make collections via model classes
        __static__Collection: Collection

    });

    // have to create our own extender to ensure the Collection object also
    // gets extended
    var makeExtender = function(Parent)
    {
        var extender = Parent.extend;
        var Collection = Parent.Collection;

        return function(obj) {
            var Child = extender.apply(this, arguments);

            obj = obj || {};

            var cHash = _(obj.Collection || {}).extend({
                __override__url: obj.urlRoot || '',
                __override__model: Child
            });

            Child.Collection = Collection.extend(cHash);

            Child.extend = makeExtender(Child);

            return Child;
        };
    };

    // prime the first extender
    Model.extend = makeExtender(Model);

    return Model;
});
