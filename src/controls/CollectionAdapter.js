define(function(require, exports, module) {

    var compose    = require('compose');
    var Adapter    = require('./Adapter');
    var withEvents = require('../event/withEvents');
    var Collection = require('../model/Collection');

    var CollectionAdapter = compose.using(Adapter, withEvents).defineClass({

        // takes collection in the hash
        __constructor__CollectionAdapter: function(opts)
        {
            CollectionAdapter.Super.apply(this, arguments);

            this.collection = opts.collection || opts;

            if (!this.collection.is(Collection))
                throw new Error (
                    'Must instantiate CollectionAdapter with Collection');

            this._viewCache = {};

            // proxy all events from collection
            this.listenTo(this.collection, 'all', function(e) {
                this.trigger(e);
            });
        },

        __override__getCount: function()
        {
           return this.collection.length; 
        },

        __override__getItem: function(id)
        {
           return this.collection.get(id); 
        },

        __override__getView: function(id)
        {
        }

    });

    return CollectionAdapter;
});
