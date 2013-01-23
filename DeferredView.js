define(function(require) {

    var TemplateView = require('./TemplateView');
    var View         = require('./View');
    var _            = require('underscore');

    var CLOSE_DELAY = 1000;
    var CLASS_NAME  = 'robo-deferred-view';

    require('less!./res/deferred-view.less');

    var DeferredView = TemplateView.extend();

    // add the "open" class once the UI thread ends and the element shows up in
    // the DOM
    DeferredView.prototype.render = function()
    {
        this.$el.addClass(CLASS_NAME);

        var self = this;
        _.defer(function() {
            self.$el
                .addClass('open')
                .addClass('opened');
        });

        return TemplateView.prototype.render.call(this);
    };

    // only actually remove from DOM after a bit
    DeferredView.prototype.close = function()
    {
        this.$el
            .removeClass('open')
            .addClass('closed');

        this.trigger(View.ON.HIDE);

        var self = this;
        setTimeout(function() {
            TemplateView.prototype.close.call(self);
        }, CLOSE_DELAY);
    };

    return DeferredView;
});
