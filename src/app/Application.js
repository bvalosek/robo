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
            this.onStart();
            return this;
        },

        // Link up stuff, should only be called once and probably by the App
        __fluent__setupRoutes: function(routes)
        {
            var routeHash = {};
            var _this = this;

            _(routes).each(function(C, key) {
                var name = C.__name__;
                var controller = new C(_this);

                // For each member, route our hashes
                _(compose.signature(C)).each(function(info, key) {
                    if (info.decorations.ROUTE) {
                        var route = key == 'index' ? '' : key;
                        var args = compose.getFunctionSignature(info.value);

                        args.forEach(function(a) {
                            route += a.required ? '/:x' : '(/:x)';
                        });

                        routeHash[route] = controller[key].bind(controller);
                    }
                });

            });

            // startup backbone router
            this.router = new (Backbone.Router.extend({ routes: routeHash }))();
            Backbone.history.start({ pushState: true });

            return this;
        },

        // Override to do stuff on app boot
        __virtual__onStart: function() {}

    });

});
