define(function(require, exports, module) {

    var compose = require('../compose');
    var _       = require('underscore');

    // give an object templating abilities
    var withTemplate = function(html)
    {
        this._html = html || '';

        // generate the HTML from the template
        this.getHtml = function()
        {
            // cache template
            if(!this.template) {
                this.template = _.template(this._html);
            }

            return this.template(this);
        };

        // change the template being used
        this.setTemplate = function(html)
        {
            this._html = html;
            this.template = null;

            return this;
        };

        // clobber render
        this.render = function()
        {
            this.$el.html(this.getHtml());
            return this;
        };
    };

    return withTemplate;

});
