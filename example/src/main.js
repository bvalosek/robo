var loader        = require('../../lib/xml/loader');
var Log           = require('../../lib/util/Log');
var HomeViewModel = require('./HomeViewModel');
var R             = require('./R');
var Person        = require('./Person');

Log.w('starting');

var vm   = global.vm   = new HomeViewModel();
Log.w('vm created');

var view = global.view = loader(R('home.xml')).setElement(document.body);
Log.w('view instantiated');

view.setDataContext(vm);
Log.w('data context set');


