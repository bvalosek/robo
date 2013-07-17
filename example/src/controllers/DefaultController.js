var typedef       = require('typedef');
var Log           = require('../../../lib/util/Log');
var Controller    = require('../../../lib/app/Controller');
var loader        = require('../../../lib/xml/loader');
var HomeViewModel = require('../view-models/HomeViewModel');
var R             = require('../R');

module.exports = DefaultController =
typedef.class('DefaultController').extends(Controller).define({

    __route__index: function()
    {
        Log.d('DefaultController::index route');

        var vm     = new HomeViewModel();
        var view = loader(R('views/home.xml'), {element: document.body});

        global.vm   = vm;
        global.view = view;
    }

});
