var Log           = require('../../lib/util/Log');
var loader        = require('../../lib/xml/loader');
var HomeViewModel = require('./view-models/HomeViewModel');
var R             = require('./R');

var vm   = global.vm   = new HomeViewModel();
var view = global.view = loader(R('views/home.xml'), {element: document.body});

view.setDataContext(vm);

