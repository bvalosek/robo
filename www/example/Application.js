define(function(require) {

    var RoboApp           = require('lib/robo/Application');

    // styles
    require('less!./res/example.less');

    var Application = RoboApp.extend();

    // main function
    Application.prototype.onCreate = function()
    {

    };

    return Application;
});
