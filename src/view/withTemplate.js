define(function(require, exports, module) {

    var compose = require('compose');
    var _       = require('underscore');

    // transforms a view-like into something that uses underscore templates
    var withTemplate = compose.defineMixin({
        __name__: 'withTemplate',

        // generate the HTML from the template, caching the templating function
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

        // change the template being used, but doesn't compile until first
        // getHtml call
        setTemplate: function(html)
        {
            this.template = html;
            this._compiledTemplate = null;

            return this;
        },

        // Will completely set the internal HTML of the element
        __before__render: function()
        {
            this.$el.html(this.getHtml());
            return this;
        }

    });

    return withTemplate;
});
