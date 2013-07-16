var typedef          = require('typedef');
var Log              = require('../../../lib/util/Log');
var Controller       = require('../../../lib/app/Controller');
var ObservableObject = require('../../../lib/event/ObservableObject');
var RxParser         = require('../../../lib/xml/RxParser');
var HomeViewModel    = require('../view-models/HomeViewModel');
var R                = require('../R');

var ContentControl   = require('../../../lib/control/ContentControl');

module.exports = DefaultController =
typedef.class('DefaultController').extends(Controller).define({

    __route__index: function()
    {
        Log.d('DefaultController::index route');

        var vm     = new HomeViewModel();
        var layout = new RxParser().parse(R('views/home.xml'));

        global.vm   = vm;
        global.view = layout;
    }

});
