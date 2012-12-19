define(function(require) {

    var Backbone    = require('backbone');
    var _           = require('underscore');

    var Application = require('./Application');
    var log         = require('./log');
    var Collection  = require('./Collection');

    var Model = Backbone.Model.extend();

    // create the collection object as well
    var _extend = Model.extend;
    Model.extend = function(opts)
    {
        var M =  _extend.apply(this, arguments);

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

    // generate API url with user ID if the app provides
    Model.prototype.url = function()
    {
        var url     = Backbone.Model.prototype.url.call(this);
        var context = Application.getInstance();

        if (context && context.getUserId())
            url += '?userId=' + context.getUserId();

        return url;
    };

    return Model;
});
