define(function(require) {

    var compose = require('compose');

    return compose.class('Controller').define({

        // Setup a ROUTES static constant that points route to a key on an
        // instantiated controller to use
        __ondefine__: function(Ctor)
        {
            var root   = Ctor.__name__.toLowerCase();
            var routes = {};

            _(Ctor.__annotations__).each(function(info, key) {
                if (info.ROUTE) {
                    var route = key == 'index' ? '' : key;
                    var args = compose.getFunctionSignature(Ctor.prototype[key]);

                    args.forEach(function(a) { 
                        
                        route += a[0] === '_' ? '(/:x)' : '/:x'; 
                    });

                    routes[route] = key;
                }
            });

            Ctor.ROUTES = routes;
            Ctor.__annotations__.ROUTES = {PUBLIC: true, STATIC: true};
        }

    });

});
