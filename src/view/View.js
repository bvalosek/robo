define(function(require) {

    var compose    = require('compose');
    var WithEvents = require('robo/event/WithEvents');

    // Any object that can be ansigned to a DOM node
    return compose.class('View').uses(WithEvents).define({

        // Initial values for creation only, should not be read during run-time
        // as assigning a new element to the View could potential mean that
        // this would no longer reflect the actual tag
        __virtual__readonly__tagName: 'div',
        __virtual__readonly__className: '',

        // Create the cids and make sure we have an element to rock
        constructor: function(args)
        {
            // mixin stuff easily
            _(this).extend(args);

            this.cid = _.uniqueId(this.__name__ || 'view').toLowerCase();
            this.ensureElement();
        },

        // change the DOM element this guy is hosted by, and ensure the DOM
        // node points back to the view as well. Need to un-delegate and
        // re-delegate events as well
        __fluent__setElement: function(el)
        {
            if (el && el !== this.element)
                this.unsetElement();

            this.element = el;
            el.roboView = this;
            return this;
        },

        __fluent__unsetElement: function()
        {
            if (!this.element)
                return;

            this.element.roboView = undefined;
            this.element = undefined;
            return this;
        },

        // Draw the element
        __fluent__virtual__render: function()
        {
            return this;
        },

        // Remove the the view from the DOM and destroy all events. This kills
        // the view and it is no longer usable after
        close: function()
        {
        },

        // Make sure we're pointing to a host DOM element
        ensureElement: function()
        {
            if (!this.element)
                this.element = document.createElement(this.tagName);

            this.setElement(this.element);
            return this;
        },

        // Should probably only be used for debugging
        __fluent__print: function(s)
        {
            this.element.innerText += s + '\n';
            return this;
        }
    });

});
