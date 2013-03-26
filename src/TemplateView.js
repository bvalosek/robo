define(function(require, exports, module) {

    var View = require('./View');
    var _    = require('underscore');

    var TemplateView = View.extend({

        __virtual__template: '',

        __constructor__TemplateView: function()
        {
            TemplateView.Super.apply(this, arguments);
        },

        // generate the HTML from the template
        getHtml: function()
        {
            if (!this.template)
                return null;

            // cache template
            if(!this._compiledTemplate) {
                this._compiledTemplate = _.template(this.template);
            }

            return this._compiledTemplate(this);
        },

        // change the template being used
        setTemplate: function(html)
        {
            this.template = html;
            this._compiledTemplate = null;

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
