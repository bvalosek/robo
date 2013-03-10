define(function(require, exports, module) {

    var compose    = require('./compose');
    var Collection = require('./Collection');

    // create BackboneModel that has the compose.js goodies baked in
    var BackboneModel = Backbone.Model.extend();
    compose.mixin(BackboneModel.prototype, compose.withCompose);

    var Model = BackboneModel.extend();

    // have to create our own extender to ensure the Collection object also
    // gets extended
    var makeExtender = function(Parent)
    {
        var extender = Parent.extend;
        var Collection = Parent.Collection;

        return function(obj) {
            Child = extender.apply(this, arguments);

            obj = obj || {};

            var cHash = _(obj.Collection || {}).extend({
                url: obj.urlRoot || '',
                model: Child
            });

            Child.Collection = Collection.extend(cHash);

            Child.extend = makeExtender(Child);

            return Child;
        };
    };

    // Static class let's us make collections via model classes
    Model.Collection = Collection;

    Model.extend = makeExtender(Model);

    return Model;
});