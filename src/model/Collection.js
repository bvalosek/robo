define(function(require, exports, module) {

    var Backbone           = require('backbone');
    var BackboneCollection = require('../backbone/Collection');

    var Collection = BackboneCollection.extend({

        __constructor__Collection: function()
        {
            Collection.Super.apply(this, arguments);
        },

        // should be overridden to point to endpoint
        __virtual__url: '',

        // should be overridden
        __virtual__model: null

    });

    return Collection;
});
