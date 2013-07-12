var typedef       = require('typedef');

var Log           = require('../../../lib/util/Log');
var Controller    = require('../../../lib/app/Controller');
var TextInput     = require('../../../lib/widget/TextInput');
var Binding       = require('../../../lib/event/Binding');

var HomeViewModel = require('../HomeViewModel');
var R             = require('../R');

module.exports = DefaultController =
typedef.class('DefaultController').extends(Controller).define({

    __route__index: function()
    {
        Log.d('Index route on default controller');

        // Inflate layout
        document.body.innerHTML = R('home.html');

        // Instantiate controls
        var input = new TextInput().setElement(document.querySelector('input'));
        var button = document.querySelector('button');
        var span = document.querySelector('span');

        // Instantiate view model
        var vm = new HomeViewModel();

        // Bind VM observables to controls
        new Binding().setSource(vm, 'text').setTarget(input, 'value');
        new Binding().setSource(vm, 'disableSubmit').setTarget(button, 'disabled');
        new Binding().setSource(vm, 'submitCaption').setTarget(button, 'innerText');
        new Binding().setSource(vm, 'message').setTarget(span, 'innerText');

        global.vm = vm;
    }

});
