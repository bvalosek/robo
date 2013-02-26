define(function(require, exports, module) {

    var asRenderable = require('./mixins/asRenderable');
    var compose      = require('./compose');
    var Base         = require('robo/Base');
    var Backbone     = require('backbone');
    var Application  = require('robo/Application');

    // create BackboneView object that has the compose.js goodies baked in
    var BackboneView = Backbone.View.extend();
    compose.mixin(BackboneView.prototype, compose.withCompose);

    // new View object that is robo-like but extending from backbone.js
    var View = BackboneView.extend({

        // opts.silent = no event fired
        close: function(opts)
        {
            opts = opts || {};

            if (!opts.silent)
                this.trigger('close');

            this.remove();
            this.off();
            this.stopListening();

            return this;
        },

        // dumbly print out to the DOM
        print: function(s)
        {
            this.$el.html(this.$el.html() + s + '<br>');
            return this;
        },

        // erase the HTML
        clearHtml: function()
        {
            this.$el.html('');
            return this;
        },

        setElement: function()
        {
            View.Super.prototype.setElement.apply(this, arguments);
            return this;
        },

        delegateEvents: function()
        {
            View.Super.prototype.delegateEvents.apply(this, arguments);
            return this;
        },

        setClass: function(className)
        {
            this.$el.attr('class', className);
            return this;
        },

        addClass: function(className)
        {
            this.$el.addClass(className);
            return this;
        },

        removeClass: function(className)
        {
            this.$el.removeClass(className);
            return this;
        },

        getClassName: function()
        {
            return this.$el.attr('class');
        },

        busTrigger: function()
        {
            Application.getContext().trigger.apply(this, arguments);
        },

        render: function()
        {
            return this;
        }

    });

    return View;
});
