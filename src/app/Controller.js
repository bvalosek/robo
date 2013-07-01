define(function(require) {

    var compose = require('compose');

    // Controllers are used to handle routes
    return compose.class('Controller').define({

        app: null,

        // Make sure to stash the application context
        __constructor__: function(context)
        {
            this.app = context;
        },

        // Signal we want to route
        route: function(uri)
        {
            this.app.route(uri);
        },

        // Setup a ROUTES static constant that points route to a key on an
        // instantiated controller to use
        __ondefine__: function(Ctor)
        {
            var root   = Ctor.__name__.toLowerCase();
            var routes = {};

            _(Ctor.__signature__).each(function(info, key) {
                if (info.decorations.ROUTE) {
                    var route = key == 'index' ? '' : key;
                    var args = compose.getFunctionSignature(Ctor.prototype[key]);

                    args.forEach(function(a) {
                        route += a[0] === '_' ? '(/:x)' : '/:x';
                    });

                    routes[route] = key;
                }
            });

            Ctor.ROUTES = routes;
        }

    });

});
