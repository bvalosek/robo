define(function(require) {

    var compose = require('compose');
    var _       = require('underscore');

    compose.namespace('robo.view');

    return compose.mixin('WithTemplate').define({

        // generate the HTML from the template, caching the templating function
        getTemplateHtml: function()
        {
            if (!this.template)
                return '';

            // cache template
            if(!this._compiledTemplate) {
                this._compiledTemplate = _.template(this.template);
            }

            return this._compiledTemplate(this);
        },

        // change the template being used, but doesn't compile until first
        // getHtml call
        __fluent__setTemplate: function(html)
        {
            this.template = html;
            this._compiledTemplate = null;

            return this;
        },

        // Will completely set the internal HTML of the element
        __before__render: function()
        {
            this.element.innerHTML = this.getTemplateHtml();
        }

    });

});
