define(function(require) {

    var Application   = require('lib/robo/Application');
    var HelloActivity = require('./HelloActivity');

    var MyApp = Application.extend();

    MyApp.prototype.onCreate = function()
    {
    };

    // create the main singleton app object
    return MyApp;
});
