define(function(require) {

    var View            = require('./View');
    var TemplateManager = require('./TemplateManager');
    var log             = require('./log');

    var TemplateView = View.extend();

    // render HTML based on a template
    TemplateView.prototype.render = function()
    {
        this.clear();

        var self = this;

        // inflate the template into this view
        return new TemplateManager()
            .get(this.options.template, function(t) {
                var html = t({
                    options: self.options,
                    model: self.model,
                    self: self
                });

                self.$el.html(html);
                log('rendered ' + self.options.template);
            });
    };

    return TemplateView;
});
