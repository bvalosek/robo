define(function(require) {

    var TemplateView = require('./TemplateView');
    var _            = require('underscore');

    var CLOSE_DELAY = 1000;

    var LazyView = TemplateView.extend();

    LazyView.prototype.render = function()
    {
        var self = this;
        _.defer(function() {
            self.$el.addClass('open');
        });

        return TemplateView.prototype.render.call(this);
    };

    LazyView.prototype.close = function()
    {
        this.$el.removeClass('open');

        var self = this;
        setTimeout(function() {
            TemplateView.prototype.close.call(self);
        }, CLOSE_DELAY);
    };

    return LazyView;
});
