define(function(require) {

    var TemplateView = require('./TemplateView');
    var View         = require('./View');
    var _            = require('underscore');

    var CLOSE_DELAY = 1000;

    require('less!./res/deferred-view.less');

    var DeferredView = TemplateView.extend({
        className: 'deferred-view'
    });

    // add the "open" class once the UI thread ends and the element shows up in
    // the DOM
    DeferredView.prototype.render = function()
    {
        _.defer(function() {
            this.$el
                .addClass('open')
                .addClass('opened');
        }.bind(this));

        return TemplateView.prototype.render.call(this);
    };

    // only actually remove from DOM after a bit
    DeferredView.prototype.close = function()
    {
        this.$el
            .removeClass('open')
            .addClass('closed');

        this.trigger(View.ON.HIDE);

        setTimeout(function() {
            TemplateView.prototype.close.call(this);
        }.bind(this), CLOSE_DELAY);
    };

    return DeferredView;
});
