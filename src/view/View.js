define(function(require) {

    var compose         = require('compose');
    var WithEvents      = require('robo/event/WithEvents');
    var WithDomEvents   = require('robo/event/WithDomEvents');

    // Any object that can be ansigned to a DOM node
    return compose.class('View').uses(WithEvents, WithDomEvents).define({

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

            this.initEvents();

            this.cid = _.uniqueId(this.constructor.__name__);

            // redraw if an observable triggers
            var _this = this;
            this.on('change', function(e) {
                _this.render();
                e.stopPropagation();
                return false;
            });

            // instantiate a dom node if we dont have one
            if (!this.element)
                this.element = document.createElement(this.tagName);

            this.setElement(this.element);
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

            // update events on the DOM
            var _this = this;
            _(this._events).each(function(info, event) {
                _(info).each(function(i) {
                    _this.element.addEventListener(event, i.callback);
                });
            });

            return this;
        },

        // Add a new robo view to an existing view
        __fluent__appendView: function(view)
        {
            this.element.appendChild(view.element);
            view.render();
            return this;
        },

        // Disconnect the DOM element from the view, should ONLY happen when
        // we're about to re-assign the element as it is expected a View always
        // has an element
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
        __fluent__close: function()
        {
            this.getChildViews().forEach(function(v) { v.close(); });
            this.element.parentNode.removeChild(this.element);

            return this;
        },

        // Get any child nodes that have a robo View attached to them
        getChildViews: function()
        {
            var views = [];

            var nodes = this.element.childNodes;

            for(var i = 0; i < nodes.length; i++)
                if (nodes[i].roboView) views.push(nodes[i].roboView);

            return views;
        },

        // Should probably only be used for debugging
        print: function(s)
        {
            this.element.innerText += s + '\n';
        }
    });

});
