var typedef          = require('typedef');
var _                = require('underscore');
var ObservableObject = require('../event/ObservableObject');

module.exports = View = typedef

// Any object that can be ansigned to a DOM node
.class('View') .extends(ObservableObject) .define({

    // Initial values for creation only, should not be read during run-time as
    // assigning a new element to the element could potential mean that this
    // would no longer reflect the actual tag. Use the 'tag' property when
    // passed to the constructor to actually set the tag up for inflation
    __virtual__readonly__tagName   : 'div',

    // This is observable so that we can bind to it from other things that want
    // to depend on us for their data context
    __observable__dataContext: undefined,

    // Create the cids and make sure we have an element to rock
    __constructor__: function(_args)
    {
        // mixin stuff easily
        _(this).extend(_args);

        this.cid = _.uniqueId(this.constructor.__name__);

        // instantiate a dom node if we dont have one
        if (!this.element)
            this.element = document.createElement(
                (_args || {}).tag || this.tagName);

        // Allow us to keep track of any bindings we make
        this.bindings    = [];

        // if we change the datacontext, switch everything
        //

        this.setElement(this.element);
    },


    // Change our data context and update any of our bindings' source
    __fluent__setDataContext: function(ds)
    {
        this.dataContext = ds;

        _(this.bindings).each(function(b) {
            b.setSource(ds, b.prop);
        });

        return this;
    },

    // Change the DOM element this guy is hosted by, and ensure the DOM
    // node points back to the robo element as well. Need to un-delegate
    // and re-delegate events as well
    __fluent__setElement: function(el)
    {
        if (el && el !== this.element)
            this.unsetElement();

        this.element   = el;
        el.roboElement = this;

        // listen to DOM events for everything we have bind.
        // DANGEROUS: depends on with WithEvents implementation
        var _this = this;
        _(this.__events).each(function(info, event) {
            _(info).each(function(i) {
                _this.element.addEventListener(event, i.callback);
            });
        });

        return this;
    },

    // Disconnect the DOM element from the robo element, should ONLY happen
    // when we're about to re-assign the element as it is expected a View
    // always has an element
    __fluent__unsetElement: function()
    {
        if (!this.element)
            return;

        // rmeove all events
        // DANGEROUS: depends on with WithEvents implementation
        var _this = this;
        _(this.__events).each(function(info, event) {
            _(info).each(function(i) {
                _this.element.removeEventListener(event, i.callback);
            });
        });

        this.element.roboElement = undefined;
        this.element             = undefined;

        return this;
    }

});

