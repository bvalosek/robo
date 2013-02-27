define(function(require, exports, module) {

    var compose = require('../compose');
    var _       = require('underscore');

    var asCompositable = function()
    {
        this._views = [];

        this.addView = function(view)
        {
            view.render();
            if (this._animationContext) {
                this._animationContext.queue(function() {
                    this.$el.append(view.$el);
                }.bind(this));
            } else {
                this.$el.append(view.$el);
            }

            // bind close event to ensure if the view closes itself it is
            // removed from here
            this.listenTo(view, 'close', function() { this.removeView(view); });

            return this.attachView(view);
        };

        this.removeView = function(view)
        {
            this._views = _(this._views).without(view);
        };

        this.forEach = function(fn)
        {
            _(this._views).each(fn);
            return this;
        };

        this.attachView = function(view)
        {
            this._views.push(view);
            return this;
        };

        this.factory = function(View)
        {
            var v = new View();
            v.animationContext = this._animationContext;

            return v;
        };

        this.closeViews = function()
        {
            this._views.forEach(function(v) { v.close(); });
            return this;
        };

        this.setView = function(view)
        {
            this.closeViews();
            this.addView(view);
        };

        // render all child views as well
        this.render = compose.wrap(this.render, function(render) {
            render();

            this._views.forEach(function(v) { v.render(); });
            return this;
        }.bind(this));

        // close all child views
        this.close = compose.wrap(this.close, function(close) {
            close();

            this.closeViews();
            return this;
        }.bind(this));
    };

    return asCompositable;
});
