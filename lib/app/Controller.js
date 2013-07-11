var typedef = require('typedef');

// Controllers are used to handle routes
var Controller = typedef.class('Controller').define({

    __events__: [
        'onUnload'
    ],

    __virtual__handleRoute: function(r)
    {
        // by default fire off the index endpoint
        this.index();
    }

});

module.exports = Controller;
