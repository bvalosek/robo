define(function(require) {

    var Application   = require('lib/robo/Application');
    var HelloActivity = require('./HelloActivity');

    var MyApp = Application.extend();

    // App entry point
    MyApp.prototype.onCreate = function()
    {
        this.startActivity(HelloActivity);
    };

    return MyApp;
});
