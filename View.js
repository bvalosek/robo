define(function(require) {

    var Backbone = require('backbone');
    var _        = require('underscore');

    var log      = require('./log');

    var View = Backbone.View.extend({
        className: 'view'
    });

    // events
    View.ON = {
        HIDE: 'view:hide',
        CLOSE: 'view:close'
    };

    // properly setup the child extended
    var makeExtender = function(Parent)
    {
        // capture old extend
        var _extend = Parent.extend;

        return function(childOpts)
        {
            childOpts = childOpts || {};

            var Child = _extend.call(this, childOpts);
            Child.prototype.className = (childOpts.className || '')
                + (Parent.prototype.className
                    ? ' ' + Parent.prototype.className
                    : '');

            // propagate extender
            Child.extend = makeExtender(Child);
            return Child;
        };
    };

    View.extend = makeExtender(View);

    // return the view that we append child views to
    // Override used e.g. templating
    View.prototype.getContainerView = function()
    {
        if (!this._containerView)
            this._containerView = this;

        return this._containerView;
    };

    View.prototype.setContainerViewByElement = function($view)
    {
        this._containerView = new View({ el: $view });
    };

    // add child views
    View.prototype.appendView = function(view)
    {
        var container = this.getContainerView();

        container._views = container._views || [];

        container._views.push(view);
        container.$el.append(view.$el);

        return view.render();
    };

    // just track a view -- e.g. when it's already exists on the DOM
    View.prototype.addChild = function(view)
    {
        var container = this.getContainerView();
        container._views = container._views || [];
        container._views.push(view);

        return view.render();
    };

    // set a single view
    View.prototype.setView = function(view)
    {
        var container = this.getContainerView();

        container.clear();
        return container.appendView(view);
    };

    // clear all children
    View.prototype.clear = function()
    {
        var container = this.getContainerView();

        _(container._views).each(function(v) { v.close(); });
        container._views = [];
    };

    // dumb append to HTML
    View.prototype.print = function(s)
    {
        this.getContainerView().$el.append(s + '<br>');
    };

    // cleanup view
    View.prototype.close = function()
    {
        this.trigger(View.ON.CLOSE);

        this.clear();
        this.remove();
        this.unbind();
        this.stopListening();

        log('closing view ' + (this.options.template || this.cid));
    };

    return View;
});
