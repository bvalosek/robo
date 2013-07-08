var compose          = require('compose');
var _                = require('underscore');
var WithEvents       = require('../event/WithEvents');
var WithDomEvents    = require('../event/WithDomEvents');
var ObservableObject = require('../event/ObservableObject');

// Any object that can be ansigned to a DOM node
var UiElement = compose
    .class('UiElement')
    .extends(ObservableObject)
    .uses(WithDomEvents)
    .define({

    // Initial values for creation only, should not be read during run-time
    // as assigning a new element to the element could potential mean that
    // this would no longer reflect the actual tag
    __virtual__readonly__tagName   : 'div',
    __virtual__readonly__className : '',

    // Create the cids and make sure we have an element to rock
    __constructor__: function(args)
    {
        // mixin stuff easily
        _(this).extend(args);

        // bind any events with EVENT decoration
        this.initEvents();

        this.cid = _.uniqueId(this.constructor.__name__);

        // instantiate a dom node if we dont have one
        if (!this.element)
            this.element = document.createElement(this.tagName);

        this.setElement(this.element);
    },

    // Create a new UI element and set dom
    __static__fromSelector: function(selector)
    {
        return UiElement.fromDom(document.querySelector(selector));
    },

    // If we've already selected a dom element
    __static__fromDom: function(el)
    {
        return new UiElement().setElement(el);
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

        this.render();
        return this;
    },

    // Instrucut an element to draw itself
    __virtual__fluent__render: function()
    {
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
    },

    // Remove the the robo element from the DOM and destroy all events.
    // This kills the element and it is no longer usable after
    __fluent__close: function()
    {
        this.element.parentNode.removeChild(this.element);
        return this;
    }

});

module.exports = UiElement;


