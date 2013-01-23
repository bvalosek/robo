define(function(require) {

    var Backbone = require('backbone');
    var _        = require('underscore');

    var Collection = Backbone.Collection.extend();

    // convenience method
    Collection.prototype.search = function(searchOptions)
    {
        return this.fetch({ data: searchOptions });
    };

    // poor naming to avoid collision with new backbone method
    Collection.prototype.updateAll = function(options)
    {
        var update = new $.Deferred();

        if (this._dirty)
            return update.resolve();

        // create a shallow copy of the main collection, but make sure to shuck
        // of any bindings we may have gotten along with it
        var fresh = _(this).clone();
        fresh.off();

        // update the clone collection, then do a smart merge when we're done
        fresh.fetch(options)
        .done(function() {
            var ids = [];

            // add new
            fresh.each(function(m) {
                var exisiting = this.get(m.id);

                var hasChanged = exisiting ?
                    !_(exisiting.attributes).isEqual(m.attributes) : false;

                if (hasChanged) {
                    exisiting.set(m.attributes);
                } else if (!exisiting) {
                    this.add(m);
                }

                ids.push(m.id);
            }.bind(this));

            // remove missing
            this.remove(this.filter(function(x) {
                return !_(ids).contains(x.id);
            }));

            // copy over search results
            this.count        = fresh.count;
            this.offset       = fresh.offset;
            this.totalResults = fresh.totalResults;

            update.resolve();
        }.bind(this));

        return update;
    };

    return Collection;
});
