var typedef    = require('typedef');
var Controller = require('../../../lib/app/Controller');

module.exports = DefaultController =
typedef.class('DefaultController').extends(Controller).define({

    __route__index: function()
    {
        Log.d('Index route');
    }

});
