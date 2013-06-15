define(function(require) {

    var compose = require('compose');
    var WithEvents = require('robo/event/WithEvents');

    return compose.class('View').uses(WithEvents).define({

        // initial values for creation only
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
        // node points back to the view as well
        setElement: function(el)
        {
            if (el && el !== this.element)
                this.unsetElement();

            this.element = el;
            el.roboView = this;
            return this;
        },

        unsetElement: function()
        {
            if (!this.element)
                return;

            this.element.roboView = undefined;
            this.element = undefined;
            return this;
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
        print: function(s)
        {
            this.element.innerText += s + '\n';
        }
    });

});
