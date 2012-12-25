define(function(require) {

    var View = require('./View');
    var $    = require('jquery');
    var _    = require('underscore');

    var TemplateView = View.extend();

    // render HTML based on a template
    TemplateView.prototype.render = function()
    {
        this.clear();

        // html can be set in options or on root
        var html = this.html || this.options.html;
        if (html && !this.template) {
            this.template = _.template(html);
        }

        // inflate
        if (this.template) {
            this.$el.html(this.template({
                view: this
            }));
        }

        // typically return a deferred on render
        return new $.Deferred().resolve();
    };

    return TemplateView;
});
