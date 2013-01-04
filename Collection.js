define(function(require) {

    var Backbone = require('backbone');
    var _        = require('underscore');

    var Collection = Backbone.Collection.extend();

    // poor naming to avoid collision with new backbone method
    Collection.prototype.updateAll = function(options)
    {
        if (this._dirty)
            return new $.Deferred().resolve();

        var fresh = _(this).clone();
        fresh.off();

        // update the clone collection, then do a smart merge when we're done
        var update = new $.Deferred();
        fresh.fetch(options).done(_(function() {
            var ids = [];

            // add new
            fresh.each(_(function(m) {
                var exisiting = this.get(m.id);

                var hasChanged = exisiting ?
                    !_(exisiting.attributes).isEqual(m.attributes) : false;

                if (hasChanged) {
                    exisiting.set(m.attributes);
                } else if (!exisiting) {
                    this.add(m);
                }

                ids.push(m.id);
            }).bind(this));

            // remove missing
            this.remove(this.filter(function(x) {
                return !_(ids).contains(x.id);
            }));

            // copy over search results
            this.count        = fresh.count;
            this.offset       = fresh.offset;
            this.totalResults = fresh.totalResults;

            update.resolve();
        }).bind(this));

        return update;
    };

    return Collection;
});
