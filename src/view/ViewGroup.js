define(function(require, exports, module) {

    var _           = require('underscore');
    var View        = require('./View');
    var ViewManager = require('./ViewManager');

    // A view that is used to contain child views. Managed decently by ensuring
    // when a child is closed elsewhere, it is removed from the list, etc
    var ViewGroup = View.using(ViewManager).extend({

        __constructor__ViewGroup: function()
        {
            ViewGroup.Super.apply(this, arguments);

            this.views = [];
        },

        __override__addView: function(view)
        {
            // bind close event to ensure if the view closes itself it is
            // removed from here
            this.listenTo(view, 'close', function() { this.removeView(view); });
            this.views.push(view);
            view.render();
            this.$el.append(view.$el);
        },

        setView: function(view)
        {
            this.closeViews();
            this.addView(view);
        },

        __override__removeView: function()
        {
            this.views = _(this.views).without(view);
        },

        // render all child views
        __override__render: function()
        {
            ViewGroup.Super.prototype.render.apply(this, arguments);

            this.views.forEach(function(v) { v.render(); });
        },

        // When closing all child views, they should automatically remove
        // themselves from the array on close
        closeViews: function()
        {
            this.views.forEach(function(v) { v.close(); });

            // all views should be gone out of the list, having been bound when
            // added. If there's not, there's a problem.
            if (this.views.length)
                throw new Error('Views remaining in ViewGroup after close');
        }

    })

    return ViewGroup;
});
