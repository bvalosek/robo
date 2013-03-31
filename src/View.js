define(function(require, exports, module) {

    var compose      = require('compose');
    var Application  = require('./Application');
    var helpers      = require('./helpers');
    var _            = require('underscore');
    var $            = require('jquery');
    var BackboneView = require('./backbone/View');

    // new View object that is robo-like but extending from backbone.js
    var View = BackboneView.extend({

        __new__virtual__readonly__tagName    : 'div',
        __new__virtual__readonly__className  : '',
        __new__virtual__readonly__attributes : null,

        __constructor__View: function()
        {
            View.Super.apply(this, arguments);

            _(this.constructor.findMembers('VIEWEVENT')).each(function(key) {
                this.delegate(key, this[key]);
            }.bind(this));
        },

        // opts.silent = no event fired
        close: function(opts)
        {
            opts = opts || {};

            if (!opts.silent) {
                this.trigger('close');

                if (this._closed)
                    throw new Error('View must be silently closed if closed more than once');
            }

            this._closed = true;

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

        __new__setElement: function()
        {
            View.Super.prototype.setElement.apply(this, arguments);
            return this;
        },

        // delegate a single event, potentially can break since it relies on
        // undocumented backbone patterns
        delegate: function(selector, event, method)
        {
            // 2 args
            if (arguments.length == 2) {
                method = event; event = selector; selector = '';
            }

            // cram it in
            var key = event + (selector ? ' ' + selector  : '');
            this.events = this.events || {};

            if (this.events[key])
                throw new Error('Cannot delegate to the same condition twice');

            this.events[key] = method;

            var eventName = event + '.delegateEvents' + this.cid;
            method = method.bind(this);

            if (!selector)
                this.$el.bind(eventName, method);
            else
                this.$el.delegate(selector, eventName, method);

            return this;
        },

        // will clobber any existing events
        __new__delegateEvents: function(events)
        {
            this.events = events || this.events;

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

        __new__virtual__render: function()
        {
            return this;
        }

    });

    return View;
});
