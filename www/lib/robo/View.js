define(function(require) {

    var Backbone    = require('backbone');
    var _           = require('underscore');

    var log = require('lib/robo/log');

    // inherit from Backbone style view
    var View = Backbone.View.extend();

    // events
    View.ON = {
        HIDE: 'view:hide',
        CLOSE: 'view:close'
    };

    // add child views
    View.prototype.appendView = function(view)
    {
        this._views = this._views || [];

        this._views.push(view);
        this.$el.append(view.$el);

        return view.render();
    };

    // set a single view
    View.prototype.setView = function(view)
    {
        this.clear();
        return this.appendView(view);
    };

    // clear all children
    View.prototype.clear = function()
    {
        _(this._views).each(function(v) { v.close(); });
        this._views = [];
    }

    // dump append to HTML
    View.prototype.print = function(s)
    {
        this.$el.append(s);
    };

    // cleanup view
    View.prototype.close = function()
    {
        this.clear();
        this.remove();
        this.unbind();
        this.stopListening();

        this.trigger(View.ON.CLOSE);
        log('closing view ' + this.options.template || this.cid);
    };

    return View;
});
