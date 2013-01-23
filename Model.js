define(function(require) {

    var Backbone    = require('backbone');
    var _           = require('underscore');
    var Collection  = require('./Collection');

    var Model = Backbone.Model.extend();

    // create the collection object as well
    Model.extend = function(opts)
    {
        var M =  Backbone.Model.extend.apply(this, arguments);

        M.Collection = Collection.extend({
            url: opts ? opts.urlRoot : '',
            model: M
        });

        return M;
    };

    // we changed the model
    Model.prototype.setDirty = function()
    {
        this._dirty = true;
    };

    Model.prototype.clearDirty = function()
    {
        this._dirty = false;
    };

    // manage dirty flag
    Model.prototype.sync = function(method, model, opts)
    {
        this.setDirty();

        var d = Backbone.sync.call(this, method, this, opts);

        d.done(function() {
            this.clearDirty();
        }.bind(this));

        return d;
    };

    return Model;
});
