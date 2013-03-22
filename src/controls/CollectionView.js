define(function(require, exports, module) {

    var Control        = require('../Control');
    var asCompositable = require('../mixins/asCompositable');
    var View           = require('../View');
    var _              = require('underscore');
    var TemplateView   = require('../TemplateView');

    var CollectionView = Control.using(asCompositable).extend({

        __constructor__CollectionView: function(opts)
        {
            CollectionView.Super.apply(this, arguments);

            this.collection = opts.collection;
            this.View       = opts.View;

            this._viewCache = {};

            // blindly re-render the whole list on these events, not best if
            // they are being called frequently
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'reset', this.reset);
        },

        // given an index, fetch the view and bind the model
        getView: function(model)
        {
            if (!this.View)
                return;

            if (_(model).isNumber())
                model = this.collection.get(index);

            if (!model)
                return;

            // check the cache so we don't have to do the stupidly expensive
            // view creation
            var v;
            if ( (v = this._viewCache[model.cid])) {
                return null;
            }

            // generate the view and bind all the find stuff so its LIVE
            var view = new this.View();
            view.model = model;

            this._viewCache[model.cid] = view;

            view.listenTo(model, 'change', view.render);
            view.listenTo(model, 'remove', view.close);

            return view;
        },

        __override__render: function()
        {
            // remove all current views
            // this.closeViews();

            // add each one to our DOM #expensive
            this.collection.each(function(model) {
                var v = this.getView(model);
                if (v)
                    this.addView(v);
            }.bind(this));
        },

        reset: function()
        {
            this.closeViews();
        }

    });

    return CollectionView;
});
