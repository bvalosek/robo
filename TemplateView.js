define(function(require) {

    var View = require('./View');
    var $    = require('jquery');
    var _    = require('underscore');

    var TemplateView = View.extend();

    // special stuff
    TemplateView.prototype.initialize = function(opts)
    {
        this._env = {};
        if (!opts)
            return;

        _(this._env).extend(opts.fn, opts.data);
    };

    // render HTML based on a template
    TemplateView.prototype.render = function()
    {
        this.clear();

        // html can be set in options or on root
        var html = this.html || this.options.html;
        if (html && !this.template) {
            this.template = _.template(html);
        }

        var opts = _({ view: this }).extend(this._env);

        // inflate
        if (this.template) {
            this.$el.html(this.template(opts));
        }

        // typically return a deferred on render
        return new $.Deferred().resolve();
    };

    return TemplateView;
});
