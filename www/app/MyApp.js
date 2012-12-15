define(function(require) {

    var Application = require('lib/robo/Application');

    var MyApp = Application.extend();

    MyApp.prototype.onCreate = function()
    {
        console.log('A robo app');
    };

    // create the main singleton app object
    return MyApp;
});
