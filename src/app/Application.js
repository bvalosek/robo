define(function(require, exports, module) {

    var Observable    = require('robo/event/Observable');
    var WithEvents    = require('robo/event/WithEvents');
    var Log           = require('robo/util/Log');
    var View          = require('robo/view/View');
    var Backbone      = require('backbone');
    var compose       = require('compose');
    var RoboException = require('robo/util/RoboException');

    compose.namespace('robo.app');

    // Starting point for a Robo app. Call Application#start() to boot up
    return compose.class('Application')
        .uses(WithEvents)
        .implements(Observable).define({

        _started: false,

        // Ensure we setup our events
        constructor: function()
        {
            this.initEvents();
        },

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
                throw new RoboException('Application already started');

            // stash <body>
            this.rootView = new View()
                .setElement(document.querySelector('body'));

            // got em
            this._started = true;
            Log.d('Application started');
            this.trigger('applicationStart');
            return this;
        },

        // Link up stuff
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
                    Log.d('Route added: "' + r + '" -> ' + C.__name__ + '::' + fk);
                });

            });

            // startup backbone router
            this.router = new (Backbone.Router.extend({ routes: routeHash }))();
            Backbone.history.start({ pushState: true });

            return this;
        }

    });

});
