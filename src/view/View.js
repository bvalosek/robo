define(function(require) {

    var compose = require('compose');
    var WithEvents = require('robo/event/WithEvents');

    return compose.class('View').uses(WithEvents).define({

        __virtual__readonly__tagName: 'div',
        __virtual__readonly__className: '',

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
        },

        unsetElement: function()
        {
            if (!this.element)
                return;

            this.element.roboView = undefined;
            this.element = undefined;
        },

        // make sure we're pointing to a host DOM element
        ensureElement: function()
        {
            if (!this.element)
                this.element = document.createElement(this.tagName);

            this.setElement(this.element);
        }
    });

});
