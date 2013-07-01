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

    });

});
