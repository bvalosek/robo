define(function(require, exports, module) {

    var compose            = require('./compose');
    var Backbone           = require('backbone');
    var BackboneCollection = require('./backbone/Collection');

    var Collection = BackboneCollection.extend({

        // should be overridden to point to endpoint
        __virtual__url: '',

        // should be overridden
        __virtual__model: null

    });

    return Collection;
});
