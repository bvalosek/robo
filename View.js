define(function(require, exports, module) {

    var asRenderable = require('./mixins/asRenderable');
    var compose      = require('./compose');
    var Application  = require('./Application');
    var Base         = require('./Base');
    var Backbone     = require('backbone');
    var helpers      = require('./helpers');
    var _            = require('underscore');
    var $            = require('jquery');
    var log          = require('./log');

    // create BackboneView object that has the compose.js goodies baked in
    var BackboneView = Backbone.View.extend();
    compose.mixin(BackboneView.prototype, compose.withCompose);

    // new View object that is robo-like but extending from backbone.js
    var View = BackboneView.extend({

        // opts.silent = no event fired
        close: function(opts)
        {
            opts = opts || {};

            log('closing ' + this.cid);

            if (!opts.silent) {
                this.trigger('close');
            }

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

        // delegate a single event, potentially can break since it relies on
        // undocumented backbone patterns
        delegate: function(selector, event, method)
        {
            // cram it in
            var key = event + (selector ? ' ' + selector  : '');
            this.events = this.events || {};
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
        delegateEvents: function(events)
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

        busTrigger: function()
        {
            Application.getContext().trigger.apply(this, arguments);
        },

        render: function()
        {
            return this;
        },

        inject: function(View)
        {
            // apply all the arguments to the constructor
            var v =  helpers.applyToConstructor.apply(this, arguments);
            v.parent = this;

            // make sure to close thew new v when this view closes
            this.on('close', v.close.bind(v));

            // a bit later bind the actual dom element to the HTML we insterted
            _(function() {
                v.setElement(this.$('[data-cid="' + v.cid + '"]')).render();
            }.bind(this)).defer();

            // return placeholder text to insert
            return  $('<div>').attr('data-cid', v.cid).prop('outerHTML');
        }

    });

    return View;
});
