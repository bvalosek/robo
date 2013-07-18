var Log           = require('../../lib/util/Log');
var loader        = require('../../lib/xml/loader');
var HomeViewModel = require('./HomeViewModel');
var R             = require('./R');

var vm   = global.vm   = new HomeViewModel();
var view = global.view = loader(R('home.xml'), {element: document.body});

view.setDataContext(vm);

