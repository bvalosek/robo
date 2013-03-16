define(function(require, exports, module) {

    var View = require('./View');
    var _    = require('underscore');

    var TemplateView = View.extend({

        // generate the HTML from the template
        getHtml: function()
        {
            if (!this._html)
                return null;

            // cache template
            if(!this.template) {
                this.template = _.template(this._html);
            }

            return this.template(this);
        },

        // change the template being used
        setTemplate: function(html)
        {
            this._html = html;
            this.template = null;

            return this;
        },

        // clobber render
        __override__render: function()
        {
            TemplateView.Super.prototype.render.call(this);

            this.$el.html(this.getHtml());
            return this;
        }

    });

    return TemplateView;
});
