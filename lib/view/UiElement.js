var typedef          = require('typedef');
var _                = require('underscore');
var WithEvents       = require('../event/WithEvents');
var ObservableObject = require('../event/ObservableObject');

module.exports = UiElement = typedef

// Any object that can be ansigned to a DOM node
.class('UiElement') .extends(ObservableObject) .define({

    // Initial values for creation only, should not be read during run-time as
    // assigning a new element to the element could potential mean that this
    // would no longer reflect the actual tag. Use the 'tag' property when
    // passed to the constructor to actually set the tag up for inflation
    __virtual__readonly__tagName   : 'div',
    __virtual__readonly__className : '',

    // Create the cids and make sure we have an element to rock
    __constructor__: function(args)
    {
        // mixin stuff easily
        _(this).extend(args);

        this.cid = _.uniqueId(this.constructor.__name__);

        // instantiate a dom node if we dont have one
        if (!this.element)
            this.element = document.createElement((args || {}).tag || this.tagName);

        this.setElement(this.element);
    },

    // Change the DOM element this guy is hosted by, and ensure the DOM
    // node points back to the robo element as well. Need to un-delegate
    // and re-delegate events as well
    __fluent__setElement: function(el)
    {
        if (el && el !== this.element)
            this.unsetElement();

        this.element = el;
        this.style = el.style;
        el.roboElement = this;

        // update events on the DOM
        var _this = this;
        _(this._events).each(function(info, event) {
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
        var _this = this;
        _(this._events).each(function(info, event) {
            _(info).each(function(i) {
                _this.element.removeEventListener(event, i.callback);
            });
        });

        this.element.roboElement = undefined;
        this.element = undefined;
        this.style = {};

        return this;
    }

});

module.exports = UiElement;


