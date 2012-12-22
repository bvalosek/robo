define(function(require) {

    var TemplateView = require('./TemplateView');
    var View         = require('./View');
    var _            = require('underscore');

    var CLOSE_DELAY = 1000;
    var CLASS_NAME  = 'robo-lazy-view';

    require('less!./res/lazy-view.less');

    var LazyView = TemplateView.extend();

    // add the "open" class once the UI thread ends and the element shows up in
    // the DOM
    LazyView.prototype.render = function()
    {
        this.$el.addClass(CLASS_NAME);

        var self = this;
        _.defer(function() {
            self.$el.addClass('open');
        });

        return TemplateView.prototype.render.call(this);
    };

    // only actually remove from DOM after a bit
    LazyView.prototype.close = function()
    {
        this.$el.removeClass('open');

        this.trigger(View.ON.HIDE);

        var self = this;
        setTimeout(function() {
            TemplateView.prototype.close.call(self);
        }, CLOSE_DELAY);
    };

    return LazyView;
});
