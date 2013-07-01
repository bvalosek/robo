define(function(require, exports, module) {

    var WithEvents    = require('robo/event/WithEvents');
    var Log           = require('robo/util/Log');
    var View          = require('robo/view/View');
    var compose       = require('compose');

    // Starting point for a Robo app. Call start() to boot up
    return compose.class('Application').uses(WithEvents).define({

        _started: false,

        // Route to something
        __fluent__route: function(uri)
        {
            this.router.navigate(uri, {trigger: true});
            return this;
        },

        // Called when
        __fluent__start: function()
        {
            if (this._started)
                throw new Error('Application already started');

            // stash <body>
            this.rootView = new View()
                .setElement(document.querySelector('body'));

            // got em
            this._started = true;
            Log.d('Application started');
            this.trigger('applicationStart');
            return this;
        },

        // Link up stuff, should only be called once
        __fluent__setupRoutes: function(routes)
        {
            var routeHash = {};
            var _this = this;

            _(routes).each(function(C, key) {
                var name = C.__name__;
                var controller = new C(_this);

                _(C.ROUTES).each(function(fk, route) {
                    var fn = C.prototype[fk];
                    var r = key + route;
                    routeHash[r] = controller[fk].bind(controller);
                });

            });

            // startup backbone router
            this.router = new (Backbone.Router.extend({ routes: routeHash }))();
            Backbone.history.start({ pushState: true });

            return this;
        }

    });

});
