define(function(require) {

    var Backbone    = require('backbone');
    var _           = require('underscore');

    var Collection  = require('./Collection');

    var Model = Backbone.Model.extend();

    // create the collection object as well
    Model.extend = function(opts)
    {
        var M =  Backbone.Model.extend.apply(this, arguments);

        if(opts && opts.urlRoot) {
            M.Collection = Collection.extend({
                url: opts.urlRoot,
                model: M
            });
        }

        return M;
    };

    Model.prototype.setDirty = function()
    {
        this._dirty = true;
    };

    // a bit of custom behavior
    Model.prototype.sync = function(method, model, opts)
    {
        this._dirty = true;
        var d = Backbone.sync.call(this, method, this, opts);

        d.done(_(function() {
            this._dirty = false;
        }).bind(this));

        return d;
    };

    return Model;
});
