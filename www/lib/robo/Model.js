define(function(require) {

    var Backbone    = require('backbone');
    var _           = require('underscore');

    var log         = require('./log');
    var Collection  = require('./Collection');

    var Model = Backbone.Model.extend();

    // create the collection object as well
    Model.extend = function(opts)
    {
        var M =  Backbone.Model.extend.apply(this, arguments);

        // Create corresponding collection class
        M.Collection = Collection.extend({
            url: opts.urlRoot,
            model: M
        });

        return M;
    };

    // override backbone server method here
    Model.prototype.sync = function(method, model, opts)
    {
        // call the method and claer dirty when done
        var self = this;
        var d = Backbone.sync.call(this, method, this, opts);
        d.done(function() {
            self.dirty = false;
        });
        return d;
    };

    return Model;
});
