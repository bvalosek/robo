var loader        = require('../../lib/xml/loader');
var HomeViewModel = require('./HomeViewModel');
var R             = require('./R');
var Person        = require('./Person');

var vm   = global.vm   = new HomeViewModel();
var view = global.view = loader(R('home.xml'), {element: document.body});
var me   = global.me   = new Person();

view.setDataContext(vm);

