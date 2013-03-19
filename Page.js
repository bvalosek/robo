define(function(require, exports, module) {

    var View             = require('./View');
    var AnimationContext = require('./AnimationContext');
    var log              = require('./log');
    var helpers          = require('./helpers');
    var $                = require('jquery');
    var _                = require('underscore');

    var Page = View.extend({

        __constructor__Page: function()
        {
            Page.Super.call(this);

            // keep track of a single animation context
            this.animationContext = new AnimationContext();

            // when dom loads, try to find a dump and chumped data
            $(function() {

                // defer until the call stack is empty to make sure whatever is
                // creating us can finish
                _(function() {
                    if (window.page)
                        this.data = window.page;

                    // base view
                    this.setElement($('body'));

                    // start the page with any dump n chump
                    this.onStart(this.data);

                    // hash bind
                    window.onhashchange = this.handleHashChange.bind(this);

                    // react to the initial hash
                    this.handleHashChange();

                }.bind(this)).defer();

            }.bind(this));
        },

        changeHash: function(hash, silent)
        {
            if (silent)
                this._ignoreHashChange = true;

            window.location.hash = hash;
        },

        handleHashChange: function()
        {
            var hash = helpers.getWindowHash();

            if (!this._ignoreHashChange) {
                log('# -> ' + helpers.getWindowHash());
                this.handleViewState(helpers.getWindowHash());

                // trigger if we have anything
                if (hash === '') hash = 'index';

                var annotations = this.constructor.__annotations__[hash];
                if (annotations && annotations.PAGEROUTE)
                    this[hash]();

            } else {
                this._ignoreHashChange = false;
            }
        },

        // convenience function to listen to app events
        listenToApp: function(event, fn)
        {
            return this.listenTo(this.application, event, fn);
        },

        // defer a binding until the call stack clears taht sets a jquery on
        // ready callback
        onReady: function(fn)
        {
            _(function() {
                $(fn.bind(this));
            }.bind(this)).defer();
        },

        setTitle: function(s)
        {
            document.title = s;
        },

        // create a view-like object with the animation context pre-set
        viewFactory: function(Renderable)
        {
            var v = new Renderable();
            v.animationContext = this.animationContext;
            return v;
        },

        // called once page has loaded
        __virtual__onStart: function() {},

        // used to handle a hash fragment
        __virtual__handleViewState: function() {}

    });

    return Page;
});
