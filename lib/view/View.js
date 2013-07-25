var ObservableObject = require('../event/ObservableObject');
var typedef          = require('typedef');
var _                = require('underscore');

module.exports = View = typedef

// Any object that can be ansigned to a DOM node. This is the lowest-level
// object that is used for all layouts, controls, views, etc
.class('View') .extends(ObservableObject) .define({

    // Initial values for creation only, should not be read during run-time as
    // assigning a new element to the element could potential mean that this
    // would no longer reflect the actual tag. Use the 'tag' property when
    // passed to the constructor to actually set the tag up for inflation
    __virtual__readonly__tagName : 'div',

    // This is observable so that we can bind to it from other things that want
    // to depend on us for their data context
    __observable__dataContext: undefined,

    // CSS class name. One-way bound with DOM stuff, so can only reliably be
    // updated via this property
    __observable__className: '',

    // Create the cids and make sure we have an element to rock
    __constructor__: function(_args)
    {
        _(this).extend(_args);

        this.cid = _.uniqueId(this.constructor.__name__);

        if (!this.element)
            this.element = document.createElement(
                (_args || {}).tag || this.tagName);

        this.setElement(this.element);

        this.bindings = [];

        this.onPropertyChange('dataContext', this._updateBindings);
        this.onPropertyChange('className', function() {
            this.element.className = this.className;
        });
    },

    // DOM-wise stuff
    _initDomEvents: function()
    {
        var _this = this;
        _(typedef.signature(this.constructor)).each(function(info, key) {
            if (info.decorations.DOMEVENT) {
                _this.onDomEvent(key, info.value);
            }
        });
    },

    __fluent__onDomEvent: function(name, fn)
    {
        var _this = this;
        this.element.addEventListener(name, function(event) {
            fn.call(_this, event);
        });

        return this;
    },

    // Semi IoC, we create a new binding such that we target ourselves with the
    // data context as the source
    __fluent__addBinding: function(targetProp, sourceProp, _dataContext)
    {
        var ds = _dataContext || this.dataContext;
        var b  = new Binding().setTarget(this, targetProp);

        if (ds)
            b.setSource(ds, sourceProp);
        else
            b.prop = sourceProp;

        this.bindings.push(b);
        return this;
    },

    // Change our data context and update any of our bindings' source
    __fluent__setDataContext: function(ds)
    {
        this.dataContext = ds;
        return this;
    },

    // Ensure all bindings point to our data context
    _updateBindings: function()
    {
        var ds = this.dataContext;
        _(this.bindings).each(function(b) {
            b.setSource(ds, b.prop);
        });
    },

    // Change the DOM element this guy is hosted by, and ensure the DOM
    // node points back to the robo element as well. Need to un-delegate
    // and re-delegate events as well
    __fluent__setElement: function(el)
    {
        if (el && el !== this.element) {
            this.changeElement(el);
            return this;
        } else if (el === this.element)
            return this;

        this.element   = el;
        el.roboElement = this;

        var _this = this;
        _(this.__events).each(function(info, event) {
            _(info).each(function(i) {
                _this.element.addEventListener(event, i.callback);
            });
        });

        this._initDomEvents();
        this.render();
        return this;
    },

    __fluent__setAttributes: function(hash)
    {
        var _this = this;
        _(hash).each(function(value, key) {
            _this.element.setAttribute(key, value);
        });

        return this;
    },

    // Update the DOM element with whatever we think we've got
    __fluent__virtual__render: function()
    {
        return this;
    },

    // Gotta re-asign our element
    __fluent__changeElement: function(el)
    {
        if (!this.element || !el)
            return;

        this.element.tagName = el.tagName;
        var parent = el.parentNode;
        parent.removeChild(el);
        parent.appendChild(this.element);

        return this;
    },

    // Done with this view, clear out all references
    __fluent__close: function()
    {
        this.element.parentNode.removeChild(this.element);
        this.element.removeEventListener();
        this.element.roboElement = undefined;
        this.element             = undefined;

        _(this.bindings).each(function(b) {
            b.clearTargets();
            b.setSource(null);
        });

        return this;
    }

});

