define(function(require, exports, module) {

    var _          = require('underscore');
    var Backbone   = require('backbone');
    var compose    = require('../compose');
    var withEvents = require('./withEvents');

    var asRenderable =  function() {

        // mixin basic backbone view stuff
        _(this).extend(Backbone.View.prototype);

        compose.mixin(this, compose.withCompose);

        // clobber on and pipe events via dom
        this.on = function()
        {
            this.$el.on.call(this.$el, arguments[0], arguments[1]);
            return this;
        };

        // clobber trigger and pipe events via dom
        this.trigger = function()
        {
            this.$el.trigger.apply(this.$el, arguments);
        };

        // setup events
        this.setEvents = function(events)
        {
            this.delegateEvents(events);
            return this;
        };

        // delegatable event
        this.delegate = function(selector, eventName, method, context)
        {
            context = context || this;

            if (!selector)
                this.$el.bind(eventName, method);
            else
                this.$el.delegate(selector, eventName, method.bind(context));
            return this;
        };

        // clobber listenTo to mimic backbone-style even agaisnt the DOM
        this.listenTo = function()
        {
            var other = arguments[0];
            var name  = arguments[1];
            var fn    = arguments[2];

            other.on(name, fn.bind(this));
            return this;
        };

        // listen on scroll
        this.onScroll = function(fn)
        {
            this.$el.scroll(fn);
            return this;
        };

        this.setupView = function()
        {
            Backbone.View.apply(this, arguments);
            return this;
        };

        this.render = function()
        {
            this.setupView();
            return this;
        };

        // opts.silent = no event fired
        this.close = function(opts)
        {
            opts = opts || {};

            if (!opts.silent)
                this.trigger('close');

            this.remove();
            this.off();
            this.stopListening();
            return this;
        };

        this.clear = function()
        {
            this.$el.html('');
            return this;
        };

        this.setElement = function()
        {
            Backbone.View.prototype.setElement.apply(this, arguments);
            return this;
        };

        this.getClassName = function()
        {
            return this.$el.attr('class');
        };

        this.setClass = function(className)
        {
            this.className = className;
            this.$el.attr('class', className);
            return this;
        };

        this.addClass = function(className)
        {
            this.$el.addClass(className);
            return this;
        };

        this.removeClass = function(className)
        {
            this.$el.removeClass(className);
            return this;
        };

        this.setParent = function(view)
        {
            if (!view.attachView)
                throw new Error('Attempting to attach to invalid view');

            view.attachView(this);
            return this;
        };

        this.addToParent = function(view)
        {
            view.addView(this);
            return this;
        };

        this.setHtml = function(html)
        {
            this.$el.html(html);
            return this;
        };

        this.print = function(s)
        {
            this.$el.html(this.$el.html() + s + '<br>');
            return this;
        };
    };

    return asRenderable;
});
