var typedef        = require('typedef');
var Log            = require('../../../lib/util/Log');
var Controller     = require('../../../lib/app/Controller');
var LayoutInflator = require('../../../lib/view/LayoutInflator');
var ObservableObject = require('../../../lib/event/ObservableObject');
var HomeViewModel  = require('../view-models/HomeViewModel');
var R              = require('../R');

var TextInput      = require('../../../lib/widget/TextInput');
var Button         = require('../../../lib/widget/Button');

module.exports = DefaultController =
typedef.class('DefaultController').extends(Controller).define({

    __route__index: function()
    {
        Log.d('DefaultController::index route');

        var vm = new HomeViewModel();

        var layout = new LayoutInflator()
            .setLayoutResource(R('views/home.xml'))
            .setDomNode(document.body)
            .inflate()
            .setDataContext(vm);

        global.vm   = vm;
        global.view = layout;
    }

});
