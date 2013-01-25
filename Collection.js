define(function(require) {

    var Backbone = require('backbone');
    var _        = require('underscore');

    var Collection = Backbone.Collection.extend();

    // convenience method
    Collection.prototype.search = function(searchOptions)
    {
        return this.fetch({ data: searchOptions });
    };

    return Collection;
});
