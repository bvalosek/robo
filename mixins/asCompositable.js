define(function(require, exports, module) {

    var compose = require('../compose');
    var _       = require('underscore');

    var asCompositable = function()
    {
        this.addView = function(view)
        {
            this._views = this._views || [];

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

            this._views.push(view);

            return this;
        };

        this.removeView = function(view)
        {
            console.log(this.cid + ' removing ' + view.cid);
            this._views = _(this._views).without(view);
        };

        this.closeViews = function()
        {
            this._views = this._views || [];

            this._views.forEach(function(v) { v.close(); });

            // all views should be gone out of the list, having been bound when
            // added. If there's not, there's a problem.
            if (this._views.length)
                throw new Error('Views remaining in composite after closing all. Probably a problem');

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

            this._views = this._views || [];

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
